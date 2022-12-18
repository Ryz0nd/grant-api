import {
  Bip39,
  EnglishMnemonic,
  Slip10,
  Slip10Curve,
  stringToPath,
} from "@cosmjs/crypto";
import { Secp256k1 } from "@cosmjs/crypto";
import { type EncodeObject } from "@cosmjs/proto-signing";
import {
  assertIsDeliverTxSuccess,
  DeliverTxResponse,
  StdFee,
} from "@cosmjs/stargate";
import { MsgExec } from "@keplr-wallet/proto-types/cosmos/authz/v1beta1/tx";
import { Dec } from "@keplr-wallet/unit";
import type {
  AccountResponse,
  Coin,
  DelegationTotalRewardsResponse,
} from "@many-things/cosmos-query";
import type { Grant } from "@many-things/cosmos-query/dist/apis/cosmos/authz/types";
import { TxResponse } from "@many-things/cosmos-query/dist/apis/cosmos/tx/types";
import axios from "axios";
import {
  AuthorizationType,
  authorizationTypeToJSON,
} from "cosmjs-types/cosmos/staking/v1beta1/authz";
import { MsgDelegate } from "cosmjs-types/cosmos/staking/v1beta1/tx";
import type { FastifyPluginAsync } from "fastify";

import { EMBED_CHAIN_INFOS } from "../constants/embedChainInfos";
import { DefaultGasPriceStep } from "../constants/gas";
import { GRANTABLE_CHAINS } from "../constants/grantableChains";
import { GRANTEE_BECH32_ADDRESSES } from "../constants/granteeAddresses";
import { MSG_EXECUTE, MSG_STAKE_AUTHORIZATION } from "../constants/msgs";
import { broadcastTx } from "../utils/broadcastTx";
import { getBech32Address } from "../utils/getBech32Address";
import { getSimulatedStdFee } from "../utils/getStdFee";
import { isEthAccount } from "../utils/isEthAccount";
import { signDirect } from "../utils/signDirect";

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
        tx: TxResponse;
        reward: Coin;
      }
    | {
        status: "error";
        message: string;
      };
}

const stakeAllV1: FastifyPluginAsync = async (fastify): Promise<void> => {
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
          const instance = axios.create({
            baseURL: chainInfo.rest,
          });

          const granterPubKey = allPubKey?.[String(chainInfo.bip44.coinType)];

          const address = allAddress?.[chainInfo.chainId];

          if (granterPubKey === undefined && address === undefined) {
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
              granterPubKey ?? "",
              chainInfo.bech32Config.bech32PrefixAccAddr
            ));

          // grantee 주소 가져오기
          const granteeAddress = GRANTEE_BECH32_ADDRESSES[chainInfo.chainName];

          // grantee 정보 가져오기
          const mnemonicChecked = new EnglishMnemonic(
            process.env.MNEMONIC as string
          );
          const seed = await Bip39.mnemonicToSeed(mnemonicChecked);
          const hdPath = stringToPath(
            `m/44'/${chainInfo.bip44.coinType}'/0'/0/0`
          );
          const { privkey: granteePrivateKey } = Slip10.derivePath(
            Slip10Curve.Secp256k1,
            seed,
            hdPath
          );
          const { pubkey } = await Secp256k1.makeKeypair(granteePrivateKey);
          const granteePublicKey = Secp256k1.compressPubkey(pubkey);

          // grant 정보 가져오기
          const {
            data: { grants },
          } = await instance.get<{ grants: Grant[] }>(
            "/cosmos/authz/v1beta1/grants",
            {
              params: {
                granter: granterAddress,
                grantee: granteeAddress,
              },
            }
          );

          // delegation Grant 확인
          const requiredGrantMessage: StakingAuthorizationGrant | undefined =
            grants.find(
              (grant: StakingAuthorizationGrant) =>
                grant.authorization["@type"] === MSG_STAKE_AUTHORIZATION &&
                grant.authorization.authorization_type ===
                  authorizationTypeToJSON(
                    AuthorizationType.AUTHORIZATION_TYPE_DELEGATE
                  ) &&
                !grant.expiration.startsWith("0001")
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
          const {
            data: { total, rewards },
          } = await instance.get<DelegationTotalRewardsResponse>(
            `/cosmos/distribution/v1beta1/delegators/${granterAddress}/rewards`
          );

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
          const {
            data: { account },
          } = await instance.get<AccountResponse>(
            `/cosmos/auth/v1beta1/accounts/${granteeAddress}`
          );

          // gas fee 확인
          const memo = "Keplr Authz";

          const simulatedStdFee = await getSimulatedStdFee({
            chainInfo,
            account,
            memo,
            protoMsgs,
          });

          const defaultStdFee = (): StdFee => {
            const delegateMsgCount = delegateMsgs.length;
            const expectedGasWanted = 350000 * delegateMsgCount;
            const gasPriceStep =
              chainInfo.gasPriceStep?.low ?? DefaultGasPriceStep.average;

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
          const sequence = isEthAccount(account)
            ? account.base_account.sequence
            : account.sequence;
          const accountNumber = isEthAccount(account)
            ? account.base_account.account_number
            : account.account_number;

          const protoSignedTx = await signDirect({
            protoMsgs,
            memo,
            accountNumber,
            sequence,
            chainInfo,
            stdFee,
            signerPubKey: granteePublicKey,
            signerPrivKey: granteePrivateKey,
          });

          // tx broadcast
          const txResponse = await broadcastTx(protoSignedTx, chainInfo.rest);

          assertIsDeliverTxSuccess(txResponse as unknown as DeliverTxResponse);
          return {
            [chainInfo.chainId]: {
              status: "success",
              tx: txResponse,
              reward: totalStakeCurrencyRewards,
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
