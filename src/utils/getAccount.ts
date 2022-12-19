import {
  Bip39,
  EnglishMnemonic,
  Secp256k1,
  Slip10,
  Slip10Curve,
  stringToPath,
} from "@cosmjs/crypto";

export const getAccount = async (mnenomic: string, coinType: number) => {
  const mnemonicChecked = new EnglishMnemonic(mnenomic);
  const seed = await Bip39.mnemonicToSeed(mnemonicChecked);
  const hdPath = stringToPath(`m/44'/${coinType}'/0'/0/0`);
  const { privkey: privateKey } = Slip10.derivePath(
    Slip10Curve.Secp256k1,
    seed,
    hdPath
  );
  const { pubkey } = await Secp256k1.makeKeypair(privateKey);
  const publicKey = Secp256k1.compressPubkey(pubkey);
  return { privateKey, publicKey };
};
