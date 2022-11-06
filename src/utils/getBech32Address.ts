import { PubKeySecp256k1 } from "@keplr-wallet/crypto";
import { Bech32Address } from "@keplr-wallet/cosmos";

export const getBech32Address = async (
  pubkey: string | Uint8Array,
  signerAddrPrefix: string
): Promise<string> => {
  const uint8ArrayPubkey: Uint8Array =
    typeof pubkey === "string" ? Buffer.from(pubkey, "hex") : pubkey;

  const urlPubKey: PubKeySecp256k1 = new PubKeySecp256k1(uint8ArrayPubkey);
  return new Bech32Address(urlPubKey.getAddress()).toBech32(signerAddrPrefix);
};
