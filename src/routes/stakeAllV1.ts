import { FastifyPluginAsync } from "fastify";
import { Coin, getCosmosQuery } from "@many-things/cosmos-query";
import { EMBED_CHAIN_INFOS } from "../constants/embedChainInfos";
import { GRANTABLE_CHAINS } from "../constants/grantableChains";
import { getBech32Address } from "../utils/getBech32Address";
import { MSG_EXECUTE, MSG_STAKE_AUTHORIZATION } from "../constants/msgs";
import {
  DirectSecp256k1HdWallet,
  EncodeObject,
  makeSignDoc,
} from "@cosmjs/proto-signing";
import { PubKey } from "cosmjs-types/cosmos/crypto/secp256k1/keys";

import {
  // assertIsDeliverTxSuccess,
  SigningStargateClient,
} from "@cosmjs/stargate";
import { Dec } from "@keplr-wallet/unit";
import { stringToPath } from "@cosmjs/crypto";

import { MsgDelegate } from "cosmjs-types/cosmos/staking/v1beta1/tx";
import { MsgExec } from "@keplr-wallet/proto-types/cosmos/authz/v1beta1/tx";
import {
  AuthorizationType,
  authorizationTypeToJSON,
} from "cosmjs-types/cosmos/staking/v1beta1/authz";
import {
  AuthInfo,
  Fee,
  SignerInfo,
  TxBody,
  TxRaw,
} from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { SignMode } from "cosmjs-types/cosmos/tx/signing/v1beta1/signing";
import { DefaultGasPriceStep } from "../constants/gas";
import dayjs from "dayjs";
import { getSimulatedStdFee } from "../utils/getStdFee";

interface StakingAuthorizationGrant {
  authorization: {
    "@type": string;
    max_tokens?: Coin | null;
    allow_list?: {
      address: string[];
    };
    authorization_type?: string;
  };
  expiration: string;
}

interface StakeAllBody {
  Body: {
    address?: {
      [chainId: string]: string;
    };
    pubKey?: {
      [coinType: string]: string;
    };
  };
}

interface StakeAllResult {
  [chain: string]:
    | {
        status: "success";
        txHash: string;
        reward: Coin;
      }
    | {
        status: "error";
        message: string;
      };
}

const stakeAllV1: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post<StakeAllBody>("/v1/stake-all", async function (request) {
    const allPubKey = request.body.pubKey;
    const allAddress = request.body.address;

    if (allPubKey === undefined && allAddress === undefined) {
      throw new Error("No address or pubKey is provided");
    }

    const grantableChainInfos = EMBED_CHAIN_INFOS.filter((chainInfo) => {
      return GRANTABLE_CHAINS.includes(chainInfo.chainName);
    });

    const stakeAllResult = await Promise.all<StakeAllResult>(
      grantableChainInfos.map(async (chainInfo) => {
        try {
          const { getGrants, getDelegationTotalRewards, getAccountByAddress } =
            getCosmosQuery(chainInfo.rest);

          const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
            process.env.MNEMONIC as string,
            {
              prefix: chainInfo.bech32Config.bech32PrefixAccAddr,
              hdPaths: [
                stringToPath(`m/44'/${chainInfo.bip44.coinType}'/0'/0/0`),
              ],
            }
          );

          const pubKey = allPubKey?.[String(chainInfo.bip44.coinType)];

          const address = allAddress?.[chainInfo.chainId];

          if (pubKey === undefined && address === undefined) {
            return {
              [chainInfo.chainId]: {
                status: "error",
                message: "Granter address is not defined",
              },
            };
          }

          const granterAddress =
            address ??
            (await getBech32Address(
              pubKey ?? "",
              chainInfo.bech32Config.bech32PrefixAccAddr
            ));

          // grantee 주소 가져오기
          const [granteeAccount] = await wallet.getAccounts();
          const granteeAddress = granteeAccount.address;

          // grant 정보 가져오기
          const { grants } = await getGrants({
            granter: granterAddress,
            grantee: granteeAddress,
          });

          // delegation Grant 확인
          const requiredGrantMessage: StakingAuthorizationGrant | undefined =
            grants.find(
              (grant: StakingAuthorizationGrant) =>
                grant.authorization["@type"] === MSG_STAKE_AUTHORIZATION &&
                grant.authorization.authorization_type ===
                  authorizationTypeToJSON(
                    AuthorizationType.AUTHORIZATION_TYPE_DELEGATE
                  ) &&
                dayjs().isBefore(grant.expiration)
            );

          const isValidGrant = requiredGrantMessage !== undefined;

          if (!isValidGrant) {
            return {
              [chainInfo.chainId]: {
                status: "error",
                message: "No delegation grant",
              },
            };
          }

          // reward 확인
          const { total, rewards } = await getDelegationTotalRewards({
            delegatorAddress: granterAddress,
          });

          const totalStakeCurrencyRewards = total.find(
            (item) => item.denom === chainInfo.stakeCurrency.coinMinimalDenom
          );

          if (totalStakeCurrencyRewards === undefined) {
            return {
              [chainInfo.chainId]: {
                status: "error",
                message: "No rewards",
              },
            };
          }
          // validator allowance 확인
          const validatorAllowList =
            requiredGrantMessage.authorization.allow_list;

          if (validatorAllowList === undefined) {
            return {
              [chainInfo.chainId]: {
                status: "error",
                message: "Allow list not provided",
              },
            };
          }
          

          // msg 생성
          const delegateMsgs = rewards.reduce((acc, reward) => {
            const isGrantValidator =
              validatorAllowList.address.find(
                (address) => address === reward.validator_address
              ) !== undefined;

            if (!isGrantValidator) {
              return [...acc];
            }

            const rewardAmount = reward.reward.find(
              (item) => item.denom === chainInfo.stakeCurrency.coinMinimalDenom
            );

            if (rewardAmount === undefined) {
              return [...acc];
            }

            const amount: Coin = {
              amount: Math.floor(Number(rewardAmount.amount)).toString(),
              denom: chainInfo.stakeCurrency.coinMinimalDenom,
            };

            const delegateMsg = {
              typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
              value: MsgDelegate.encode({
                delegatorAddress: granterAddress,
                validatorAddress: reward.validator_address,
                amount,
              }).finish(),
            };
            return [...acc, delegateMsg];
          }, [] as EncodeObject[]);

          const protoMsgs: EncodeObject[] = [
            {
              typeUrl: MSG_EXECUTE,
              value: MsgExec.encode({
                grantee: granteeAddress,
                msgs: delegateMsgs,
              }).finish(),
            },
          ];

          // account 정보 가져오기
          const { account } = await getAccountByAddress({
            address: granterAddress,
          });

          // gas fee 확인
          const memo = "Keplr Authz";

          const simulatedStdFee = await getSimulatedStdFee({
            chainInfo,
            account,
            memo,
            protoMsgs,
          });

          const defaultStdFee = () => {
            const delegateMsgCount = delegateMsgs.length;
            const expectedGasWanted = 250000 * delegateMsgCount;
            const gasPriceStep =
              chainInfo.gasPriceStep?.average ?? DefaultGasPriceStep.average;

            return {
              gas: new Dec(expectedGasWanted).toString(0),
              amount: [
                {
                  denom: chainInfo.stakeCurrency.coinMinimalDenom,
                  amount: new Dec(gasPriceStep)
                    .mul(new Dec(expectedGasWanted))
                    .toString(0),
                },
              ],
            };
          };

          const stdFee = simulatedStdFee ?? defaultStdFee();

          // signDoc 생성
          const bodyBytes = TxBody.encode(
            TxBody.fromPartial({
              messages: protoMsgs,
              memo,
            })
          ).finish();

          const authInfoBytes = AuthInfo.encode({
            signerInfos: [
              SignerInfo.fromPartial({
                publicKey: {
                  typeUrl: "/cosmos.crypto.secp256k1.PubKey",
                  value: PubKey.encode({
                    key: Buffer.from(account.pub_key.key, "base64"),
                  }).finish(),
                },
                modeInfo: {
                  single: {
                    mode: SignMode.SIGN_MODE_DIRECT,
                  },
                  multi: undefined,
                },
                sequence: account.sequence,
              }),
            ],
            fee: Fee.fromPartial<{}>({
              amount: stdFee.amount,
              gasLimit: stdFee.gas,
            }),
          }).finish();

          const signDoc = makeSignDoc(
            bodyBytes,
            authInfoBytes,
            chainInfo.chainId,
            Number(account.account_number)
          );

          const { signature, signed } = await wallet.signDirect(
            granteeAddress,
            signDoc
          );

          const protoSignedTx = TxRaw.encode({
            bodyBytes: signed.bodyBytes,
            authInfoBytes: signed.authInfoBytes,
            signatures: [Buffer.from(signature.signature, "base64")],
          }).finish();

          // tx broadcast
          const client = await SigningStargateClient.connectWithSigner(
            chainInfo.rpc,
            wallet
          );

          console.log(client, protoSignedTx)
          // const result = await client.broadcastTx(protoSignedTx);

          // assertIsDeliverTxSuccess(result);

          return {
            [chainInfo.chainId]: {
              status: "success",
              // txHash: result.transactionHash,
              reward: totalStakeCurrencyRewards,
              txHash: "hi",
            },
          };
        } catch (e) {
          return {
            [chainInfo.chainId]: {
              status: "error",
              message: "Transaction broadcast failed",
              error: e,
            },
          };
        }
      })
    );

    return stakeAllResult;
  });
};

export default stakeAllV1;
