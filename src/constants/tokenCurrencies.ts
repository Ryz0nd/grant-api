export type TokenCurrency = {
  coinDenom: string;
  coinMinimalDenom: string;
  coinDecimals: number;
  coinGeckoId?: string;
} & {
  type?: string;
  contractAddress?: string;
  pegMechanism?: string;
  isStakeCurrency?: boolean;
  isFeeCurrency?: boolean;
};

const CosmosHub = {
  ATOM: {
    coinDenom: "ATOM",
    coinMinimalDenom: "uatom",
    coinDecimals: 6,
    coinGeckoId: "cosmos",
  },
};

const Osmosis = {
  OSMO: {
    coinDenom: "OSMO",
    coinMinimalDenom: "uosmo",
    coinDecimals: 6,
    coinGeckoId: "osmosis",
  },
};

const SecretNetwork = {
  SCRT: {
    coinDenom: "SCRT",
    coinMinimalDenom: "uscrt",
    coinDecimals: 6,
    coinGeckoId: "secret",
  },
};

const Akash = {
  AKT: {
    coinDenom: "AKT",
    coinMinimalDenom: "uakt",
    coinDecimals: 6,
    coinGeckoId: "akash-network",
  },
};

const Regen = {
  REGEN: {
    coinDenom: "REGEN",
    coinMinimalDenom: "uregen",
    coinDecimals: 6,
    coinGeckoId: "regen",
  },
};

const Sentinel = {
  DVPN: {
    coinDenom: "DVPN",
    coinMinimalDenom: "udvpn",
    coinDecimals: 6,
    coinGeckoId: "sentinel",
  },
};

const Persistence = {
  XPRT: {
    coinDenom: "XPRT",
    coinMinimalDenom: "uxprt",
    coinDecimals: 6,
    coinGeckoId: "persistence",
  },
};

const CryptoOrg = {
  CRO: {
    coinDenom: "CRO",
    coinMinimalDenom: "basecro",
    coinDecimals: 8,
    coinGeckoId: "crypto-com-chain",
  },
};

const Juno = {
  JUNO: {
    coinDenom: "JUNO",
    coinMinimalDenom: "ujuno",
    coinDecimals: 6,
    coinGeckoId: "juno-network",
  },
};

const Bostrom = {
  BOOT: {
    coinDenom: "BOOT",
    coinMinimalDenom: "boot",
    coinDecimals: 0,
    coinGeckoId: "bostrom",
  },
};

const Stargaze = {
  STARS: {
    coinDenom: "STARS",
    coinMinimalDenom: "ustars",
    coinDecimals: 6,
    coinGeckoId: "stargaze",
  },
};

const Sommelier = {
  SOMM: {
    coinDenom: "SOMM",
    coinMinimalDenom: "usomm",
    coinDecimals: 6,
    coinGeckoId: "sommelier",
  },
};

const SifChain = {
  ROWAN: {
    coinDenom: "ROWAN",
    coinMinimalDenom: "rowan",
    coinDecimals: 18,
    coinGeckoId: "sifchain",
  },
};

const Umee = {
  UMEE: {
    coinDenom: "UMEE",
    coinMinimalDenom: "uumee",
    coinDecimals: 6,
    coinGeckoId: "umee",
  },
};

const GravityBridge = {
  GRAV: {
    coinDenom: "GRAV",
    coinMinimalDenom: "ugraviton",
    coinDecimals: 6,
    coinGeckoId: "graviton",
    isStakeCurrency: true,
    isFeeCurrency: true,
  },
};

const Shentu = {
  CTK: {
    coinDenom: "CTK",
    coinMinimalDenom: "uctk",
    coinDecimals: 6,
    coinGeckoId: "certik",
  },
};

const Injective = {
  INJ: {
    coinDenom: "INJ",
    coinMinimalDenom: "inj",
    coinDecimals: 18,
    coinGeckoId: "injective-protocol",
  },
};

const Evmos = {
  EVMOS: {
    coinDenom: "EVMOS",
    coinMinimalDenom: "aevmos",
    coinDecimals: 18,
    coinGeckoId: "evmos",
  },
};

const Kava = {
  KAVA: {
    coinDenom: "KAVA",
    coinMinimalDenom: "ukava",
    coinDecimals: 6,
    coinGeckoId: "kava",
  },
};

const Agoric = {
  BLD: {
    coinDenom: "BLD",
    coinMinimalDenom: "ubld",
    coinDecimals: 6,
    coinGeckoId: "agoric",
  },
  RUN: {
    coinDenom: "RUN",
    coinMinimalDenom: "urun",
    coinDecimals: 6,
  },
};

const Stride = {
  STRD: {
    coinDenom: "STRD",
    coinMinimalDenom: "ustrd",
    coinDecimals: 6,
    coinGeckoId: "stride",
  },
};

const QuickSilver = {
  QCK: {
    coinDenom: "QCK",
    coinMinimalDenom: "uqck",
    coinDecimals: 6,
  },
};

export const TOKEN_CURRENCIES: Record<string, TokenCurrency> = {
  ...CosmosHub,
  ...Osmosis,
  ...SecretNetwork,
  ...Akash,
  ...Regen,
  ...Sentinel,
  ...Persistence,
  ...CryptoOrg,
  ...Juno,
  ...Bostrom,
  ...Stargaze,
  ...Sommelier,
  ...SifChain,
  ...Umee,
  ...GravityBridge,
  ...Shentu,
  ...Injective,
  ...Evmos,
  ...Kava,
  ...Agoric,
  ...Stride,
  ...QuickSilver,
};

export const TOKEN_CURRENCIES_ARR = Object.values(TOKEN_CURRENCIES);
