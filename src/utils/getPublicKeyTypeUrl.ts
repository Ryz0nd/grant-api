import type { EmbedChainInfo } from "../constants/embedChainInfos";

export const getPublicKeyTypeUrl = (chainInfo: EmbedChainInfo) => {
    const useEthereumSign = chainInfo.features?.includes("eth-key-sign");
    if (!useEthereumSign) {
      return "/cosmos.crypto.secp256k1.PubKey";
    }

    if (chainInfo.chainId.startsWith("injective")) {
      return "/injective.crypto.v1beta1.ethsecp256k1.PubKey";
    }

    return "/ethermint.crypto.v1.ethsecp256k1.PubKey";
  };