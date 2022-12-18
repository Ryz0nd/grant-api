import axios from "axios";
import type { TxResponse } from "cosmjs-types/cosmos/base/abci/v1beta1/abci";

export const broadcastTx = async (
  protoSignedTx: Uint8Array,
  baseURL: string
) => {
  const { data: result } = await axios.post<{
    tx_response: TxResponse;
  }>(
    "/cosmos/tx/v1beta1/txs",
    {
      tx_bytes: Buffer.from(protoSignedTx).toString("base64"),
      mode: "BROADCAST_MODE_SYNC",
    },
    {
      baseURL,
    }
  );

  const txResponse = result["tx_response"];

  return txResponse;
};
