import { FastifyPluginAsync } from "fastify";
import { Coin, getCosmosQuery } from "@many-things/cosmos-query";
import { EMBED_CHAIN_INFOS } from "../constants/embedChainInfos";
import { GRANTABLE_CHAINS } from "../constants/grantableChains";
import { getBech32Address } from "../utils/getBech32Address";
import { MSG_EXECUTE, MSG_STAKE_AUTHORIZATION } from "../constants/msgs";
import { GRANTEE_BECH32_ADDRESSES } from "../constants/granteeAddresses";
import { DirectSecp256k1HdWallet, EncodeObject } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";
import { Dec } from "@keplr-wallet/unit";

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
import {
  DefaultGasPriceStep,
  DEFAULT_GAS_ADJUSTMENT_NUM,
} from "../constants/gas";
import { StdFee } from "@keplr-wallet/types";

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

    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
      process.env.MNEMONIC as string
    );

    const stakeAllResult = await Promise.all<StakeAllResult>(
      grantableChainInfos.map(async (chainInfo) => {
        try {
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

          const bech32Address =
            address ??
            (await getBech32Address(
              pubKey ?? "",
              chainInfo.bech32Config.bech32PrefixAccAddr
            ));

          const { getGrants, getDelegationTotalRewards, simulateTx } =
            getCosmosQuery(chainInfo.rest);

          // grantee address 확인
          const granteeAddress = GRANTEE_BECH32_ADDRESSES[chainInfo.chainName];
          if (granteeAddress === undefined) {
            return {
              [chainInfo.chainId]: {
                status: "error",
                message: "Grantee address is not defined",
              },
            };
          }

          // grant 정보 가져오기
          const { grants } = await getGrants({
            granter: bech32Address,
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
                  )
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
          const { total } = await getDelegationTotalRewards({
            delegatorAddress: bech32Address,
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
          const delegateMsgs = validatorAllowList.address.map(
            (validatorAddress) => {
              const sharedAmount =
                Number(totalStakeCurrencyRewards.amount) /
                validatorAllowList.address.length;
              const amount = sharedAmount.toFixed(18);
              const denom = totalStakeCurrencyRewards.denom;

              const delegateMsg = {
                typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
                value: MsgDelegate.encode({
                  delegatorAddress: bech32Address,
                  validatorAddress,
                  amount: {
                    amount,
                    denom,
                  },
                }).finish(),
              };
              return delegateMsg;
            }
          );

          const protoMsgs: EncodeObject[] = [
            {
              typeUrl: MSG_EXECUTE,
              value: MsgExec.encode({
                grantee: granteeAddress,
                msgs: delegateMsgs,
              }).finish(),
            },
          ];

          // gas fee 확인
          const memo = "Keplr Authz";

          const gasPriceStep =
            chainInfo.gasPriceStep?.average ?? DefaultGasPriceStep.average;

          let stdFee: StdFee;

          if (chainInfo.canEstimateGas) {
            const unsignedTx = TxRaw.encode({
              bodyBytes: TxBody.encode(
                TxBody.fromPartial<{}>({
                  messages: protoMsgs,
                  memo,
                })
              ).finish(),
              authInfoBytes: AuthInfo.encode({
                signerInfos: [
                  SignerInfo.fromPartial({
                    modeInfo: {
                      single: {
                        mode: SignMode.SIGN_MODE_DIRECT,
                      },
                      multi: undefined,
                    },
                    sequence: "1",
                  }),
                ],
                fee: Fee.fromPartial<{}>({
                  amount: [],
                }),
              }).finish(),
              signatures: [new Uint8Array(64)],
            }).finish();

            const simulatedTx = await simulateTx({
              body: {
                tx_bytes: Buffer.from(unsignedTx).toString("base64"),
              },
            });

            const gasUsed = parseInt(simulatedTx.gas_info.gas_used);

            const gasWantedDec = new Dec(
              gasUsed * DEFAULT_GAS_ADJUSTMENT_NUM
            ).roundUpDec();

            const gasWanted = gasWantedDec.toString(0);

            const gasPriceAmountString = gasWantedDec
              .mul(new Dec(gasPriceStep))
              .roundUpDec()
              .toString(0);

            const gasPrice: Coin = {
              denom: chainInfo.stakeCurrency.coinMinimalDenom,
              amount: gasPriceAmountString,
            };
            stdFee = {
              gas: gasWanted,
              amount: [gasPrice],
            };
          } else {
            const expectedGasWanted = 300000;

            stdFee = {
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
          }

          // tx 실행
          const client = await SigningStargateClient.connectWithSigner(
            chainInfo.rpc,
            wallet
          );

          const tx = await client.signAndBroadcast(
            bech32Address,
            protoMsgs,
            stdFee,
            memo
          );

          return {
            [chainInfo.chainId]: {
              status: "success",
              txHash: tx.transactionHash,
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
