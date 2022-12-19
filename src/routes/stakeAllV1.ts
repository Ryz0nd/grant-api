import type { EncodeObject } from "@cosmjs/proto-signing";
import { MsgExec } from "@keplr-wallet/proto-types/cosmos/authz/v1beta1/tx";
import { Dec } from "@keplr-wallet/unit";
import type {
  AccountResponse,
  Coin,
  DelegationTotalRewardsResponse,
} from "@many-things/cosmos-query";
import type { TxResponse } from "@many-things/cosmos-query/dist/apis/cosmos/tx/types";
import { isEthAccount } from "@many-things/cosmos-query";
import axios from "axios";
import { MsgDelegate } from "cosmjs-types/cosmos/staking/v1beta1/tx";
import type { FastifyPluginAsync } from "fastify";

import { EMBED_CHAIN_INFOS } from "../constants/embedChainInfos";
import { DefaultGasPriceStep } from "../constants/gas";
import { GRANTABLE_CHAINS } from "../constants/grantableChains";
import { GRANTEE_BECH32_ADDRESSES } from "../constants/granteeAddresses";
import { MSG_EXECUTE } from "../constants/msgs";
import { broadcastTx } from "../utils/broadcastTx";
import { getAccount } from "../utils/getAccount";
import { getBech32Address } from "../utils/getBech32Address";
import { getSimulatedStdFee } from "../utils/getStdFee";
import { signDirect } from "../utils/signDirect";

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

          const granteeAddress = GRANTEE_BECH32_ADDRESSES[chainInfo.chainName];
          const granterAddress =
            address ??
            (await getBech32Address(
              granterPubKey ?? "",
              chainInfo.bech32Config.bech32PrefixAccAddr
            ));

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

          // msg 생성
          const delegateMsgs = rewards.reduce((acc, reward) => {
            const rewardAmount = reward.reward.find(
              (item) => item.denom === chainInfo.stakeCurrency.coinMinimalDenom
            );

            if (rewardAmount === undefined || Number(rewardAmount.amount) < 1) {
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

          if (delegateMsgs.length === 0) {
            return {
              [chainInfo.chainId]: {
                status: "error",
                message: "No messages",
              },
            };
          }

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

          const defaultStdFee = () => {
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

          // grantee account 불러오기
          const { publicKey: granteePublicKey, privateKey: granteePrivateKey } =
            await getAccount(
              process.env.MNEMONIC as string,
              chainInfo.bip44.coinType
            );

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

          if (txResponse.code !== 0) {
            return {
              [chainInfo.chainId]: {
                status: "error",
                message: "Transaction broadcast failed",
                error: txResponse,
              },
            };
          }
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
