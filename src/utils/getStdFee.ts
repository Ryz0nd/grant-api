import { EncodeObject } from "@cosmjs/proto-signing";
import { StdFee } from "@cosmjs/stargate";
import { Dec } from "@keplr-wallet/unit";
import { getCosmosQuery } from "@many-things/cosmos-query";
import { Account } from "@many-things/cosmos-query/dist/apis/cosmos/auth/types";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";
import { SignMode } from "cosmjs-types/cosmos/tx/signing/v1beta1/signing";
import {
  AuthInfo,
  Fee,
  SignerInfo,
  TxBody,
  TxRaw,
} from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { type CustomChainInfo } from "../constants/embedChainInfos";
import {
  DefaultGasPriceStep,
  DEFAULT_GAS_ADJUSTMENT_NUM,
} from "../constants/gas";

export const getSimulatedStdFee = async ({
  chainInfo,
  account,
  protoMsgs,
  memo,
}: {
  chainInfo: CustomChainInfo;
  account: Account;
  protoMsgs: EncodeObject[];
  memo: string;
}): Promise<StdFee | null> => {
  try {
    if (chainInfo.canEstimateGas) {
      const { simulateTx } = getCosmosQuery(chainInfo.rest);

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
              sequence: account.sequence,
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

      const gasPriceStep =
        chainInfo.gasPriceStep?.average ?? DefaultGasPriceStep.average;

      const gasPriceAmountString = gasWantedDec
        .mul(new Dec(gasPriceStep))
        .roundUpDec()
        .toString(0);

      const gasPrice: Coin = {
        denom: chainInfo.stakeCurrency.coinMinimalDenom,
        amount: gasPriceAmountString,
      };
      return {
        gas: gasWanted,
        amount: [gasPrice],
      };
    }

    return null;
  } catch {
    return null;
  }
};
