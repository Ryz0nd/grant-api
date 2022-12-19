import type { EncodeObject } from "@cosmjs/proto-signing";
import { Dec } from "@keplr-wallet/unit";
import type { SimulateTxResponse } from "@many-things/cosmos-query";
import type {
  Account,
  EthereumAccount,
} from "@many-things/cosmos-query/dist/apis/cosmos/auth/types";
import { isEthAccount } from "@many-things/cosmos-query/dist/utils";
import axios from "axios";
import type { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";
import { SignMode } from "cosmjs-types/cosmos/tx/signing/v1beta1/signing";
import {
  AuthInfo,
  Fee,
  SignerInfo,
  TxBody,
  TxRaw,
} from "cosmjs-types/cosmos/tx/v1beta1/tx";

import type { CustomChainInfo } from "../constants/embedChainInfos";
import {
  DEFAULT_GAS_ADJUSTMENT_NUM,
  DefaultGasPriceStep,
} from "../constants/gas";

export const getSimulatedStdFee = async ({
  chainInfo,
  account,
  protoMsgs,
  memo,
}: {
  chainInfo: CustomChainInfo;
  account: Account | EthereumAccount;
  protoMsgs: EncodeObject[];
  memo: string;
}): Promise<{
  amount: Coin[];
  gas: string;
} | null> => {
  try {
    if (chainInfo.canEstimateGas) {
      const sequence = isEthAccount(account)
        ? account.base_account.sequence
        : account.sequence;
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
              sequence,
            }),
          ],
          fee: Fee.fromPartial<{}>({
            amount: [],
          }),
        }).finish(),
        signatures: [new Uint8Array(64)],
      }).finish();

      const {
        data: { gas_info },
      } = await axios.post<SimulateTxResponse>(
        "/cosmos/tx/v1beta1/simulate",
        { tx_bytes: Buffer.from(unsignedTx).toString("base64") },
        {
          baseURL: chainInfo.rest,
        }
      );

      const gasUsed = parseInt(gas_info.gas_used);

      const gasWantedDec = new Dec(
        gasUsed * DEFAULT_GAS_ADJUSTMENT_NUM
      ).roundUpDec();

      const gasWanted = gasWantedDec.toString(0);

      const gasPriceStep =
        chainInfo.gasPriceStep?.low ?? DefaultGasPriceStep.average;

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
