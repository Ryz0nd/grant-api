import type {
  Account,
  EthereumAccount,
} from "@many-things/cosmos-query/dist/apis/cosmos/auth/types";

export const isEthAccount = (
  account: Account | EthereumAccount
): account is EthereumAccount => {
  return account["@type"] === "/ethermint.types.v1.EthAccount";
};
