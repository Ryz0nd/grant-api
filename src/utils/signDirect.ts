import { keccak256, Secp256k1, sha256 } from "@cosmjs/crypto";
import {
  type EncodeObject,
  makeSignBytes,
  makeSignDoc,
} from "@cosmjs/proto-signing";
import type { StdFee } from "@cosmjs/stargate";
import { encodeSecp256k1Signature } from "@keplr-wallet/cosmos";
import { PubKey } from "cosmjs-types/cosmos/crypto/secp256k1/keys";
import { SignMode } from "cosmjs-types/cosmos/tx/signing/v1beta1/signing";
import {
  AuthInfo,
  Fee,
  SignerInfo,
  TxBody,
  TxRaw,
} from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { EmbedChainInfo } from "../constants/embedChainInfos";
import { getPublicKeyTypeUrl } from "./getPublicKeyTypeUrl";

export const signDirect = async ({
  protoMsgs,
  memo,
  chainInfo,
  accountNumber,
  sequence,
  stdFee,
  signerPubKey,
  signerPrivKey,
}: {
  protoMsgs: EncodeObject[];
  memo: string;
  chainInfo: EmbedChainInfo;
  accountNumber: string;
  sequence: string;
  stdFee: StdFee;
  signerPubKey: Uint8Array;
  signerPrivKey: Uint8Array;
}) => {
  const bodyBytes = TxBody.encode(
    TxBody.fromPartial({
      messages: protoMsgs,
      memo,
    })
  ).finish();

  const useEthereumSign = chainInfo.features?.includes("eth-key-sign");

  const authInfoBytes = AuthInfo.encode({
    signerInfos: [
      SignerInfo.fromPartial({
        publicKey: {
          typeUrl: getPublicKeyTypeUrl(chainInfo),
          value: PubKey.encode({
            key: signerPubKey,
          }).finish(),
        },
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
      amount: stdFee.amount,
      gasLimit: stdFee.gas,
    }),
  }).finish();

  const signDoc = makeSignDoc(
    bodyBytes,
    authInfoBytes,
    chainInfo.chainId,
    Number(accountNumber)
  );

  const signBytes = makeSignBytes(signDoc);
  const hashedMessage = useEthereumSign
    ? keccak256(signBytes)
    : sha256(signBytes);
  const signature = await Secp256k1.createSignature(
    hashedMessage,
    signerPrivKey
  );
  const signatureBytes = new Uint8Array([
    ...signature.r(32),
    ...signature.s(32),
  ]);
  const stdSignature = encodeSecp256k1Signature(signerPubKey, signatureBytes);

  const protoSignedTx = TxRaw.encode({
    bodyBytes: signDoc.bodyBytes,
    authInfoBytes: signDoc.authInfoBytes,
    signatures: [Buffer.from(stdSignature.signature, "base64")],
  }).finish();

  return protoSignedTx;
};
