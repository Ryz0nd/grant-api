export type TokenCurrency = {
  coinDenom: string;
  coinMinimalDenom: string;
  coinDecimals: number;
  coinGeckoId?: string;
  coinImageUrl?: string;
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
    coinImageUrl: "/tokens-logos/atom.png",
  },
};

const Osmosis = {
  OSMO: {
    coinDenom: "OSMO",
    coinMinimalDenom: "uosmo",
    coinDecimals: 6,
    coinGeckoId: "osmosis",
    coinImageUrl: "/tokens-logos/osmo.png",
  },
  ION: {
    coinDenom: "ION",
    coinMinimalDenom: "uion",
    coinDecimals: 6,
    coinGeckoId: "ion",
    coinImageUrl: "/tokens-logos/ion.png",
  },
};

const TerraClassic = {
  LUNC: {
    coinDenom: "LUNC",
    coinMinimalDenom: "uluna",
    coinDecimals: 6,
    coinGeckoId: "terra-luna",
    coinImageUrl: "/tokens-logos/lunc.png",
  },
  USTC: {
    coinDenom: "USTC",
    coinMinimalDenom: "uusd",
    coinDecimals: 6,
    coinGeckoId: "terrausd",
    coinImageUrl: "/tokens-logos/ustc.png",
  },
  KRTC: {
    coinDenom: "KRTC",
    coinMinimalDenom: "ukrw",
    coinDecimals: 6,
    coinImageUrl: "/tokens-logos/krtc.png",
  },
};

const SecretNetwork = {
  SCRT: {
    coinDenom: "SCRT",
    coinMinimalDenom: "uscrt",
    coinDecimals: 6,
    coinGeckoId: "secret",
    coinImageUrl: "/tokens-logos/scrt.png",
  },
  CWSCRT: {
    type: "secret20",
    contractAddress: "secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek",
    coinDenom: "Secret SCRT",
    coinDecimals: 6,
    coinImageUrl: "/tokens-logos/scrt.png",
    coinGeckoId: "secret",
    coinMinimalDenom:
      "secret20:secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek:cwscrt",
  },
};

const Akash = {
  AKT: {
    coinDenom: "AKT",
    coinMinimalDenom: "uakt",
    coinDecimals: 6,
    coinGeckoId: "akash-network",
    coinImageUrl: "/tokens-logos/akt.png",
  },
};

const Regen = {
  REGEN: {
    coinDenom: "REGEN",
    coinMinimalDenom: "uregen",
    coinDecimals: 6,
    coinGeckoId: "regen",
    coinImageUrl: "/tokens-logos/regen.png",
  },
};

const Sentinel = {
  DVPN: {
    coinDenom: "DVPN",
    coinMinimalDenom: "udvpn",
    coinDecimals: 6,
    coinGeckoId: "sentinel",
    coinImageUrl: "/tokens-logos/dvpn.png",
  },
};

const Persistence = {
  XPRT: {
    coinDenom: "XPRT",
    coinMinimalDenom: "uxprt",
    coinDecimals: 6,
    coinGeckoId: "persistence",
    coinImageUrl: "/tokens-logos/xprt.png",
  },
  PSTAKE: {
    coinDenom: "PSTAKE",
    coinMinimalDenom:
      "ibc/A6E3AF63B3C906416A9AF7A556C59EA4BD50E617EFFE6299B99700CCB780E444",
    coinDecimals: 18,
    coinGeckoId: "pstake-finance",
    coinImageUrl: "/tokens-logos/pstake.png",
  },
};

const IrisNet = {
  IRIS: {
    coinDenom: "IRIS",
    coinMinimalDenom: "uiris",
    coinDecimals: 6,
    coinGeckoId: "iris-network",
    coinImageUrl: "/tokens-logos/iris.png",
  },
};

const CryptoOrg = {
  CRO: {
    coinDenom: "CRO",
    coinMinimalDenom: "basecro",
    coinDecimals: 8,
    coinGeckoId: "crypto-com-chain",
    coinImageUrl: "/tokens-logos/cro.png",
  },
};

const Starname = {
  IOV: {
    coinDenom: "IOV",
    coinMinimalDenom: "uiov",
    coinDecimals: 6,
    coinGeckoId: "starname",
    coinImageUrl: "/tokens-logos/iov.png",
  },
};

const EMoney = {
  NGM: {
    coinDenom: "NGM",
    coinMinimalDenom: "ungm",
    coinDecimals: 6,
    coinGeckoId: "e-money",
    coinImageUrl: "/tokens-logos/ngm.png",
  },
  EEUR: {
    coinDenom: "EEUR",
    coinMinimalDenom: "eeur",
    coinDecimals: 6,
    coinGeckoId: "e-money-eur",
    coinImageUrl: "/tokens-logos/eeur.png",
  },
};

const Juno = {
  JUNO: {
    coinDenom: "JUNO",
    coinMinimalDenom: "ujuno",
    coinDecimals: 6,
    coinGeckoId: "juno-network",
    coinImageUrl: "/tokens-logos/juno.png",
  },
  NETA: {
    type: "cw20",
    contractAddress:
      "juno168ctmpyppk90d34p3jjy658zf5a5l3w8wk35wht6ccqj4mr0yv8s4j5awr",
    coinDenom: "NETA",
    coinMinimalDenom:
      "cw20:juno168ctmpyppk90d34p3jjy658zf5a5l3w8wk35wht6ccqj4mr0yv8s4j5awr:NETA",
    coinDecimals: 6,
    coinGeckoId: "neta",
    coinImageUrl: "/tokens-logos/neta.png",
  },
  MARBLE: {
    type: "cw20",
    contractAddress:
      "juno1g2g7ucurum66d42g8k5twk34yegdq8c82858gz0tq2fc75zy7khssgnhjl",
    coinDenom: "MARBLE",
    coinMinimalDenom:
      "cw20:juno1g2g7ucurum66d42g8k5twk34yegdq8c82858gz0tq2fc75zy7khssgnhjl:MARBLE",
    coinDecimals: 3,
    coinGeckoId: "marble",
    coinImageUrl: "/tokens-logos/marble.png",
  },
  HOPE: {
    type: "cw20",
    contractAddress:
      "juno1re3x67ppxap48ygndmrc7har2cnc7tcxtm9nplcas4v0gc3wnmvs3s807z",
    coinDenom: "HOPE",
    coinMinimalDenom:
      "cw20:juno1re3x67ppxap48ygndmrc7har2cnc7tcxtm9nplcas4v0gc3wnmvs3s807z:HOPE",
    coinDecimals: 6,
    coinGeckoId: "hope-galaxy",
    coinImageUrl: "/tokens-logos/hope.png",
  },
  RAC: {
    type: "cw20",
    contractAddress:
      "juno1r4pzw8f9z0sypct5l9j906d47z998ulwvhvqe5xdwgy8wf84583sxwh0pa",
    coinDenom: "RAC",
    coinMinimalDenom:
      "cw20:juno1r4pzw8f9z0sypct5l9j906d47z998ulwvhvqe5xdwgy8wf84583sxwh0pa:RAC",
    coinDecimals: 6,
    coinGeckoId: "racoon",
    coinImageUrl: "/tokens-logos/rac.png",
  },
  BLOCK: {
    type: "cw20",
    contractAddress:
      "juno1y9rf7ql6ffwkv02hsgd4yruz23pn4w97p75e2slsnkm0mnamhzysvqnxaq",
    coinDenom: "BLOCK",
    coinMinimalDenom:
      "cw20:juno1y9rf7ql6ffwkv02hsgd4yruz23pn4w97p75e2slsnkm0mnamhzysvqnxaq:BLOCK",
    coinDecimals: 6,
    coinGeckoId: "pool:block",
    coinImageUrl: "/tokens-logos/block.png",
  },
  DHK: {
    type: "cw20",
    contractAddress:
      "juno1tdjwrqmnztn2j3sj2ln9xnyps5hs48q3ddwjrz7jpv6mskappjys5czd49",
    coinDenom: "DHK",
    coinMinimalDenom:
      "cw20:juno1tdjwrqmnztn2j3sj2ln9xnyps5hs48q3ddwjrz7jpv6mskappjys5czd49:DHK",
    coinDecimals: 0,
    coinGeckoId: "pool:dhk",
    coinImageUrl: "/tokens-logos/dhk.png",
  },
  RAW: {
    type: "cw20",
    contractAddress:
      "juno15u3dt79t6sxxa3x3kpkhzsy56edaa5a66wvt3kxmukqjz2sx0hes5sn38g",
    coinDenom: "RAW",
    coinMinimalDenom:
      "cw20:juno15u3dt79t6sxxa3x3kpkhzsy56edaa5a66wvt3kxmukqjz2sx0hes5sn38g:RAW",
    coinDecimals: 6,
    coinGeckoId: "pool:raw",
    coinImageUrl: "/tokens-logos/raw.png",
  },
  ASVT: {
    type: "cw20",
    contractAddress:
      "juno17wzaxtfdw5em7lc94yed4ylgjme63eh73lm3lutp2rhcxttyvpwsypjm4w",
    coinDenom: "ASVT",
    coinMinimalDenom:
      "cw20:juno17wzaxtfdw5em7lc94yed4ylgjme63eh73lm3lutp2rhcxttyvpwsypjm4w:ASVT",
    coinDecimals: 6,
    coinGeckoId: "pool:asvt",
    coinImageUrl: "/tokens-logos/asvt.png",
  },
  JOE: {
    type: "cw20",
    contractAddress:
      "juno1n7n7d5088qlzlj37e9mgmkhx6dfgtvt02hqxq66lcap4dxnzdhwqfmgng3",
    coinDenom: "JOE",
    coinMinimalDenom:
      "cw20:juno1n7n7d5088qlzlj37e9mgmkhx6dfgtvt02hqxq66lcap4dxnzdhwqfmgng3:JOE",
    coinDecimals: 6,
    coinGeckoId: "pool:joe",
    coinImageUrl: "/tokens-logos/joe.png",
  },
  GLTO: {
    type: "cw20",
    contractAddress:
      "juno1j0a9ymgngasfn3l5me8qpd53l5zlm9wurfdk7r65s5mg6tkxal3qpgf5se",
    coinDenom: "GLTO",
    coinMinimalDenom:
      "cw20:juno1j0a9ymgngasfn3l5me8qpd53l5zlm9wurfdk7r65s5mg6tkxal3qpgf5se:GLTO",
    coinDecimals: 6,
    coinGeckoId: "pool:glto",
  },
  GKEY: {
    type: "cw20",
    contractAddress:
      "juno1gz8cf86zr4vw9cjcyyv432vgdaecvr9n254d3uwwkx9rermekddsxzageh",
    coinDenom: "GKEY",
    coinMinimalDenom:
      "cw20:juno1gz8cf86zr4vw9cjcyyv432vgdaecvr9n254d3uwwkx9rermekddsxzageh:GKEY",
    coinDecimals: 6,
    coinGeckoId: "pool:gkey",
  },
  SEJUNO: {
    type: "cw20",
    contractAddress:
      "juno1dd0k0um5rqncfueza62w9sentdfh3ec4nw4aq4lk5hkjl63vljqscth9gv",
    coinDenom: "seJUNO",
    coinMinimalDenom:
      "cw20:juno1dd0k0um5rqncfueza62w9sentdfh3ec4nw4aq4lk5hkjl63vljqscth9gv:seJUNO",
    coinDecimals: 6,
    coinGeckoId: "pool:sejuno",
  },
  BJUNO: {
    type: "cw20",
    contractAddress:
      "juno1wwnhkagvcd3tjz6f8vsdsw5plqnw8qy2aj3rrhqr2axvktzv9q2qz8jxn3",
    coinDenom: "bJUNO",
    coinMinimalDenom:
      "cw20:juno1wwnhkagvcd3tjz6f8vsdsw5plqnw8qy2aj3rrhqr2axvktzv9q2qz8jxn3:bJUNO",
    coinDecimals: 6,
  },
  SOLAR: {
    type: "cw20",
    contractAddress:
      "juno159q8t5g02744lxq8lfmcn6f78qqulq9wn3y9w7lxjgkz4e0a6kvsfvapse",
    coinDenom: "SOLAR",
    coinMinimalDenom:
      "cw20:juno159q8t5g02744lxq8lfmcn6f78qqulq9wn3y9w7lxjgkz4e0a6kvsfvapse:SOLAR",
    coinDecimals: 6,
  },
  SEASY: {
    type: "cw20",
    contractAddress:
      "juno19rqljkh95gh40s7qdx40ksx3zq5tm4qsmsrdz9smw668x9zdr3lqtg33mf",
    coinDenom: "SEASY",
    coinMinimalDenom:
      "cw20:juno19rqljkh95gh40s7qdx40ksx3zq5tm4qsmsrdz9smw668x9zdr3lqtg33mf:SEASY",
    coinDecimals: 6,
    coinGeckoId: "pool:seasy",
  },
};

const MicroTick = {
  TICK: {
    coinDenom: "TICK",
    coinMinimalDenom: "utick",
    coinDecimals: 6,
    coinGeckoId: "microtick",
    coinImageUrl: "/tokens-logos/tick.png",
  },
};

const LikeCoin = {
  LIKE: {
    coinDenom: "LIKE",
    coinMinimalDenom: "nanolike",
    coinDecimals: 9,
    coinGeckoId: "likecoin",
    coinImageUrl: "/tokens-logos/like.png",
  },
};

const IXO = {
  IXO: {
    coinDenom: "IXO",
    coinMinimalDenom: "uixo",
    coinDecimals: 6,
    coinGeckoId: "ixo",
    coinImageUrl: "/tokens-logos/ixo.png",
  },
};

const BitCanna = {
  BCNA: {
    coinDenom: "BCNA",
    coinMinimalDenom: "ubcna",
    coinDecimals: 6,
    coinGeckoId: "bitcanna",
    coinImageUrl: "/tokens-logos/bcna.png",
  },
};

const BitSong = {
  BTSG: {
    coinDenom: "BTSG",
    coinMinimalDenom: "ubtsg",
    coinDecimals: 6,
    coinGeckoId: "bitsong",
    coinImageUrl: "/tokens-logos/btsg.svg",
  },
  CLAY: {
    coinDenom: "CLAY",
    coinMinimalDenom: "ft2D8E7041556CE93E1EFD66C07C45D551A6AAAE09",
    coinDecimals: 6,
  },
  FASANO: {
    coinDenom: "FASANO",
    coinMinimalDenom: "ft25B30C386CDDEBD1413D5AE1180956AE9EB3B9F7",
    coinDecimals: 6,
  },
  D9X: {
    coinDenom: "D9X",
    coinMinimalDenom: "ft575B10B0CEE2C164D9ED6A96313496F164A9607C",
    coinDecimals: 6,
  },
  FONTI: {
    coinDenom: "FONTI",
    coinMinimalDenom: "ft56664FC98A2CF5F4FBAC3566D1A11D891AD88305",
    coinDecimals: 6,
  },
  BJKS: {
    coinDenom: "BJKS",
    coinMinimalDenom: "ft52EEB0EE509AC546ED92EAC8591F731F213DDD16",
    coinDecimals: 6,
  },
  RWNE: {
    coinDenom: "RWNE",
    coinMinimalDenom: "ftE4903ECC861CA45F2C2BC7EAB8255D2E6E87A33A",
    coinDecimals: 6,
  },
  ENMODA: {
    coinDenom: "ENMODA",
    coinMinimalDenom: "ft85AE1716C5E39EA6D64BBD7898C3899A7B500626",
    coinDecimals: 6,
  },
  "404DR": {
    coinDenom: "404DR",
    coinMinimalDenom: "ft99091610CCC66F4277C66D14AF2BC4C5EE52E27A",
    coinDecimals: 6,
  },
  N43: {
    coinDenom: "N43",
    coinMinimalDenom: "ft387C1C279D962ED80C09C1D592A92C4275FD7C5D",
    coinDecimals: 6,
  },
  LOBO: {
    coinDenom: "LOBO",
    coinMinimalDenom: "ft24C9FA4F10B0F235F4A815B15FC774E046A2B2EB",
    coinDecimals: 6,
  },
  VIBRA: {
    coinDenom: "VIBRA",
    coinMinimalDenom: "ft7020C2A8E984EEBCBB383E91CD6FBB067BB2272B",
    coinDecimals: 6,
  },
  KARINA: {
    coinDenom: "KARINA",
    coinMinimalDenom: "ft2DD67F5D99E9A141142B48474FA7B6B3FF00A3FE",
    coinDecimals: 6,
  },
  TESTA: {
    coinDenom: "TESTA",
    coinMinimalDenom: "ft4B030260D99E3ABE2B604EA2B33BAF3C085CDA12",
    coinDecimals: 6,
  },
  CMQZ: {
    coinDenom: "CMQZ",
    coinMinimalDenom: "ftD4B6290EDEE1EC7B97AB5A1DC6C177EFD08ADCC3",
    coinDecimals: 6,
  },
};

const Ki = {
  XKI: {
    coinDenom: "XKI",
    coinMinimalDenom: "uxki",
    coinDecimals: 6,
    coinGeckoId: "ki",
    coinImageUrl: "/tokens-logos/xki.png",
  },
  LVN: {
    type: "cw20",
    contractAddress:
      "ki1dt3lk455ed360pna38fkhqn0p8y44qndsr77qu73ghyaz2zv4whq83mwdy",
    coinDenom: "LVN",
    coinMinimalDenom:
      "cw20:ki1dt3lk455ed360pna38fkhqn0p8y44qndsr77qu73ghyaz2zv4whq83mwdy:LVN",
    coinDecimals: 6,
    coinGeckoId: "lvn",
  },
};

const MediBloc = {
  MED: {
    coinDenom: "MED",
    coinMinimalDenom: "umed",
    coinDecimals: 6,
    coinGeckoId: "medibloc",
    coinImageUrl: "/tokens-logos/med.png",
  },
};

const Bostrom = {
  BOOT: {
    coinDenom: "BOOT",
    coinMinimalDenom: "boot",
    coinDecimals: 0,
    coinGeckoId: "bostrom",
    coinImageUrl: "/tokens-logos/boot.png",
  },
  H: {
    coinDenom: "H",
    coinMinimalDenom: "hydrogen",
    coinDecimals: 0,
  },
  V: {
    coinDenom: "V",
    coinMinimalDenom: "millivolt",
    coinDecimals: 3,
  },
  A: {
    coinDenom: "A",
    coinMinimalDenom: "milliampere",
    coinDecimals: 3,
  },
  TOCYB: {
    coinDenom: "TOCYB",
    coinMinimalDenom: "tocyb",
    coinDecimals: 0,
  },
};

const Comdex = {
  CMDX: {
    coinDenom: "CMDX",
    coinMinimalDenom: "ucmdx",
    coinDecimals: 6,
    coinGeckoId: "comdex",
    coinImageUrl: "/tokens-logos/cmdx.png",
  },
};

const Cheqd = {
  CHEQ: {
    coinDenom: "CHEQ",
    coinMinimalDenom: "ncheq",
    coinDecimals: 9,
    coinGeckoId: "cheqd-network",
    coinImageUrl: "/tokens-logos/cheq.svg",
  },
};

const Stargaze = {
  STARS: {
    coinDenom: "STARS",
    coinMinimalDenom: "ustars",
    coinDecimals: 6,
    coinGeckoId: "stargaze",
    coinImageUrl: "/tokens-logos/stars.png",
  },
};

const Chihuahua = {
  HUAHUA: {
    coinDenom: "HUAHUA",
    coinMinimalDenom: "uhuahua",
    coinDecimals: 6,
    coinGeckoId: "chihuahua-token",
    coinImageUrl: "/tokens-logos/huahua.png",
  },
};

const LumNetwork = {
  LUM: {
    coinDenom: "LUM",
    coinMinimalDenom: "ulum",
    coinDecimals: 6,
    coinGeckoId: "lum-network",
    coinImageUrl: "/tokens-logos/lum.png",
  },
};

const Vidulum = {
  VDL: {
    coinDenom: "VDL",
    coinMinimalDenom: "uvdl",
    coinDecimals: 6,
    coinGeckoId: "vidulum",
    coinImageUrl: "/tokens-logos/vdl.png",
  },
};

const Desmos = {
  DSM: {
    coinDenom: "DSM",
    coinMinimalDenom: "udsm",
    coinDecimals: 6,
    coinGeckoId: "desmos",
    coinImageUrl: "/tokens-logos/dsm.png",
  },
};

const Dig = {
  DIG: {
    coinDenom: "DIG",
    coinMinimalDenom: "udig",
    coinDecimals: 6,
    coinGeckoId: "dig-chain",
    coinImageUrl: "/tokens-logos/dig.png",
  },
};

const Sommelier = {
  SOMM: {
    coinDenom: "SOMM",
    coinMinimalDenom: "usomm",
    coinDecimals: 6,
    coinGeckoId: "sommelier",
    coinImageUrl: "/tokens-logos/somm.png",
  },
};

const SifChain = {
  ROWAN: {
    coinDenom: "ROWAN",
    coinMinimalDenom: "rowan",
    coinDecimals: 18,
    coinGeckoId: "sifchain",
    coinImageUrl: "/tokens-logos/rowan.png",
  },
};

const BandChain = {
  BAND: {
    coinDenom: "BAND",
    coinMinimalDenom: "uband",
    coinDecimals: 6,
    coinGeckoId: "band-protocol",
    coinImageUrl: "/tokens-logos/band.svg",
  },
};

const Konstellation = {
  DARC: {
    coinDenom: "DARC",
    coinMinimalDenom: "udarc",
    coinDecimals: 6,
    coinGeckoId: "darcmatter-coin",
    coinImageUrl: "/tokens-logos/darc.png",
  },
};

const Umee = {
  UMEE: {
    coinDenom: "UMEE",
    coinMinimalDenom: "uumee",
    coinDecimals: 6,
    coinGeckoId: "umee",
    coinImageUrl: "/tokens-logos/umee.png",
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
    coinImageUrl: "/tokens-logos/grav.png",
  },
  GPSTAKE: {
    coinDenom: "PSTAKE",
    coinMinimalDenom: "gravity0xfB5c6815cA3AC72Ce9F5006869AE67f18bF77006",
    coinDecimals: 18,
    coinGeckoId: "pstake-finance",
    coinImageUrl: "/tokens-logos/pstake.png",
  },
  GWBTC: {
    coinDenom: "WBTC.grv",
    coinMinimalDenom: "gravity0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    coinDecimals: 8,
    coinGeckoId: "wrapped-bitcoin",
    coinImageUrl: "/tokens-logos/wbtc.png",
  },
  GWETH: {
    coinDenom: "WETH.grv",
    coinMinimalDenom: "gravity0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    coinDecimals: 18,
    coinGeckoId: "ethereum",
    coinImageUrl: "/tokens-logos/weth.png",
  },
  GUSDC: {
    coinDenom: "USDC.grv",
    coinMinimalDenom: "gravity0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    coinDecimals: 6,
    coinGeckoId: "usd-coin",
    pegMechanism: "collateralized",
    coinImageUrl: "/tokens-logos/usdc.png",
  },
  GDAI: {
    coinDenom: "DAI.grv",
    coinMinimalDenom: "gravity0x6B175474E89094C44Da98b954EedeAC495271d0F",
    coinDecimals: 18,
    coinGeckoId: "dai",
    pegMechanism: "collateralized",
    coinImageUrl: "/tokens-logos/dai.png",
  },
  GUSDT: {
    coinDenom: "USDT.grv",
    coinMinimalDenom: "gravity0xdAC17F958D2ee523a2206206994597C13D831ec7",
    coinDecimals: 6,
    coinGeckoId: "tether",
    pegMechanism: "collateralized",
    coinImageUrl: "/tokens-logos/usdt.png",
  },
};

const Decentr = {
  DEC: {
    coinDenom: "DEC",
    coinMinimalDenom: "udec",
    coinDecimals: 6,
    coinGeckoId: "decentr",
    coinImageUrl: "/tokens-logos/dec.png",
  },
};

const Certik = {
  CTK: {
    coinDenom: "CTK",
    coinMinimalDenom: "uctk",
    coinDecimals: 6,
    coinGeckoId: "certik",
    coinImageUrl: "/tokens-logos/ctk.png",
  },
};

const Carbon = {
  SWTH: {
    coinDenom: "SWTH",
    coinMinimalDenom: "swth",
    coinDecimals: 8,
    coinGeckoId: "switcheo",
    coinImageUrl: "/tokens-logos/swth.png",
  },
};

const Injective = {
  INJ: {
    coinDenom: "INJ",
    coinMinimalDenom: "inj",
    coinDecimals: 18,
    coinGeckoId: "injective-protocol",
    coinImageUrl: "/tokens-logos/inj.png",
  },
};

const Cerberus = {
  CRBRUS: {
    coinDenom: "CRBRUS",
    coinMinimalDenom: "ucrbrus",
    coinDecimals: 6,
    coinGeckoId: "cerberus-2",
    coinImageUrl: "/tokens-logos/crbrus.png",
  },
};

const FetchAi = {
  FET: {
    coinDenom: "FET",
    coinMinimalDenom: "afet",
    coinDecimals: 18,
    coinGeckoId: "fetch-ai",
    coinImageUrl: "/tokens-logos/fet.png",
  },
};

const AssetMantle = {
  MNTL: {
    coinDenom: "MNTL",
    coinMinimalDenom: "umntl",
    coinDecimals: 6,
    coinGeckoId: "assetmantle",
    coinImageUrl: "/tokens-logos/mntl.png",
  },
};

const Provenance = {
  HASH: {
    coinDenom: "HASH",
    coinMinimalDenom: "nhash",
    coinDecimals: 9,
    coinGeckoId: "provenance-blockchain",
    coinImageUrl: "/tokens-logos/hash.png",
  },
};

const Galaxy = {
  GLX: {
    coinDenom: "GLX",
    coinMinimalDenom: "uglx",
    coinDecimals: 6,
    coinImageUrl: "/tokens-logos/glx.png",
  },
};

const Meme = {
  MEME: {
    coinDenom: "MEME",
    coinMinimalDenom: "umeme",
    coinDecimals: 6,
    coinImageUrl: "/tokens-logos/meme.png",
  },
};

const Evmos = {
  EVMOS: {
    coinDenom: "EVMOS",
    coinMinimalDenom: "aevmos",
    coinDecimals: 18,
    coinGeckoId: "evmos",
    coinImageUrl: "/tokens-logos/evmos.png",
  },
};

const Terra = {
  LUNA: {
    coinDenom: "LUNA",
    coinMinimalDenom: "uluna",
    coinDecimals: 6,
    coinGeckoId: "terra-luna-2",
  },
};

const Rizon = {
  ATOLO: {
    coinDenom: "ATOLO",
    coinMinimalDenom: "uatolo",
    coinDecimals: 6,
    coinGeckoId: "rizon",
    coinImageUrl: "/tokens-logos/atolo.png",
  },
};

const Kava = {
  KAVA: {
    coinDenom: "KAVA",
    coinMinimalDenom: "ukava",
    coinDecimals: 6,
    coinGeckoId: "kava",
    coinImageUrl: "/tokens-logos/kava.png",
  },
  HARD: {
    coinDenom: "HARD",
    coinMinimalDenom: "hard",
    coinDecimals: 6,
    coinGeckoId: "kava-lend",
  },
  SWP: {
    coinDenom: "SWP",
    coinMinimalDenom: "swp",
    coinDecimals: 6,
    coinGeckoId: "kava-swap",
  },
  USDX: {
    coinDenom: "USDX",
    coinMinimalDenom: "usdx",
    coinDecimals: 6,
    coinGeckoId: "usdx",
  },
};

const GenesisL1 = {
  L1: {
    coinDenom: "L1",
    coinMinimalDenom: "el1",
    coinDecimals: 18,
  },
};

const Kujira = {
  KUJI: {
    coinDenom: "KUJI",
    coinMinimalDenom: "ukuji",
    coinDecimals: 6,
    coinGeckoId: "kujira",
  },
};

const Tgrade = {
  TGD: {
    coinDenom: "TGD",
    coinMinimalDenom: "utgd",
    coinDecimals: 6,
    coinGeckoId: "pool:utgd",
  },
};

const Echelon = {
  ECH: {
    coinDenom: "ECH",
    coinMinimalDenom: "aechelon",
    coinDecimals: 18,
    coinGeckoId: "echelon",
  },
};

const Odin = {
  ODIN: {
    coinDenom: "ODIN",
    coinMinimalDenom: "loki",
    coinDecimals: 6,
    coinGeckoId: "pool:odin",
  },
  GEO: {
    coinDenom: "GEO",
    coinMinimalDenom: "mGeo",
    coinDecimals: 6,
    coinGeckoId: "pool:geo",
  },
  "09W": {
    coinDenom: "O9W",
    coinMinimalDenom: "mO9W",
    coinDecimals: 6,
    coinGeckoId: "pool:o9w",
  },
};

const Crescent = {
  CRE: {
    coinDenom: "CRE",
    coinMinimalDenom: "ucre",
    coinDecimals: 6,
    coinGeckoId: "pool:ucre",
  },
};

const LumenX = {
  LUMEN: {
    coinDenom: "LUMEN",
    coinMinimalDenom: "ulumen",
    coinDecimals: 6,
  },
};

const Oraichain = {
  ORAI: {
    coinDenom: "ORAI",
    coinMinimalDenom: "orai",
    coinDecimals: 6,
    coinGeckoId: "oraichain-token",
  },
};

const Cudos = {
  CUDOS: {
    coinDenom: "CUDOS",
    coinMinimalDenom: "acudos",
    coinDecimals: 18,
    coinGeckoId: "cudos",
  },
};

const Agoric = {
  BLD: {
    coinDenom: "BLD",
    coinMinimalDenom: "ubld",
    coinDecimals: 6,
    coinGeckoId: "agoric",
    coinImageUrl: "/tokens-logos/bld.png",
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
    coinImageUrl: "/tokens-logos/strd.png",
    coinGeckoId: "stride",
  },
  STATOM: {
    coinDenom: "stATOM",
    coinMinimalDenom: "stuatom",
    coinDecimals: 6,
  },
  STSTARS: {
    coinDenom: "stSTARS",
    coinMinimalDenom: "stustars",
    coinDecimals: 6,
  },
  STOSMO: {
    coinDenom: "stOSMO",
    coinMinimalDenom: "stuosmo",
    coinDecimals: 6,
    // coinGeckoId: "osmosis",
  },
  STJUNO: {
    coinDenom: "stJUNO",
    coinMinimalDenom: "stujuno",
    coinDecimals: 6,
    // coinGeckoId: "juno-network",
  },
  STSCRT: {
    coinDenom: "stSCRT",
    coinMinimalDenom: "stuscrt",
    coinDecimals: 6,
    // coinGeckoId: "secret",
  },
};

const Rebus = {
  REBUS: {
    coinDenom: "REBUS",
    coinMinimalDenom: "arebus",
    coinDecimals: 18,
    coinGeckoId: "pool:arebus",
  },
};

const Teritori = {
  TORI: {
    coinDenom: "TORI",
    coinMinimalDenom: "utori",
    coinDecimals: 6,
    coinGeckoId: "pool:utori",
  },
};

const Axelar = {
  AXL: {
    coinDenom: "AXL",
    coinMinimalDenom: "uaxl",
    coinDecimals: 6,
    coinGeckoId: "axelar",
    coinImageUrl: "/tokens-logos/axl.png",
  },
  USDC: {
    coinDenom: "USDC",
    coinMinimalDenom: "uusdc",
    coinDecimals: 6,
    coinGeckoId: "usd-coin",
    pegMechanism: "collateralized",
    coinImageUrl: "/tokens-logos/usdc.png",
  },
  FRAX: {
    coinDenom: "FRAX",
    coinMinimalDenom: "frax-wei",
    coinDecimals: 18,
    coinGeckoId: "frax",
    pegMechanism: "hybrid",
    coinImageUrl: "/tokens-logos/frax.png",
  },
  USDT: {
    coinDenom: "USDT",
    coinMinimalDenom: "uusdt",
    coinDecimals: 6,
    coinGeckoId: "tether",
    pegMechanism: "collateralized",
    coinImageUrl: "/tokens-logos/usdt.png",
  },
  DAI: {
    coinDenom: "DAI",
    coinMinimalDenom: "dai-wei",
    coinDecimals: 18,
    coinGeckoId: "dai",
    pegMechanism: "collateralized",
    coinImageUrl: "/tokens-logos/dai.png",
  },
  WETH: {
    coinDenom: "WETH",
    coinMinimalDenom: "weth-wei",
    coinDecimals: 18,
    coinGeckoId: "weth",
    coinImageUrl: "/tokens-logos/weth.png",
  },
  WBTC: {
    coinDenom: "WBTC",
    coinMinimalDenom: "wbtc-satoshi",
    coinDecimals: 8,
    coinGeckoId: "wrapped-bitcoin",
    coinImageUrl: "/tokens-logos/wbtc.png",
  },
  LINK: {
    coinDenom: "LINK",
    coinMinimalDenom: "link-wei",
    coinDecimals: 18,
    coinGeckoId: "chainlink",
  },
  AAVE: {
    coinDenom: "AAVE",
    coinMinimalDenom: "aave-wei",
    coinDecimals: 18,
    coinGeckoId: "aave",
  },
  APE: {
    coinDenom: "APE",
    coinMinimalDenom: "ape-wei",
    coinDecimals: 18,
    coinGeckoId: "apecoin",
  },
  AXS: {
    coinDenom: "AXS",
    coinMinimalDenom: "axs-wei",
    coinDecimals: 18,
    coinGeckoId: "axie-infinity",
  },
  MKR: {
    coinDenom: "MKR",
    coinMinimalDenom: "mkr-wei",
    coinDecimals: 18,
    coinGeckoId: "maker",
  },
  RAI: {
    coinDenom: "RAI",
    coinMinimalDenom: "rai-wei",
    coinDecimals: 18,
    coinGeckoId: "rai",
  },
  SHIB: {
    coinDenom: "SHIB",
    coinMinimalDenom: "shib-wei",
    coinDecimals: 18,
    coinGeckoId: "shiba-inu",
  },
  stETH: {
    coinDenom: "stETH",
    coinMinimalDenom: "steth-wei",
    coinDecimals: 18,
    coinGeckoId: "staked-ether",
  },
  UNI: {
    coinDenom: "UNI",
    coinMinimalDenom: "uni-wei",
    coinDecimals: 18,
    coinGeckoId: "uniswap",
  },
  XCN: {
    coinDenom: "XCN",
    coinMinimalDenom: "xcn-wei",
    coinDecimals: 18,
    coinGeckoId: "chain-2",
  },
  WGLMR: {
    coinDenom: "WGLMR",
    coinMinimalDenom: "wglmr-wei",
    coinDecimals: 18,
    coinGeckoId: "wrapped-moonbeam",
  },
  DOT: {
    coinDenom: "DOT",
    coinMinimalDenom: "dot-planck",
    coinDecimals: 10,
    coinGeckoId: "polkadot",
    coinImageUrl: "/tokens-logos/dot.svg",
  },
};

const MarsProtocol = {
  MARS: {
    coinDenom: "MARS",
    coinMinimalDenom: "umars",
    coinDecimals: 6,
    coinGeckoId: "mars",
    coinImageUrl: "/token-logos/mars.svg",
  },
};

export const TOKEN_CURRENCIES: Record<string, TokenCurrency> = {
  ...CosmosHub,
  ...Osmosis,
  ...TerraClassic,
  ...SecretNetwork,
  ...Akash,
  ...Regen,
  ...Sentinel,
  ...Persistence,
  ...IrisNet,
  ...CryptoOrg,
  ...Starname,
  ...EMoney,
  ...Juno,
  ...MicroTick,
  ...LikeCoin,
  ...IXO,
  ...BitCanna,
  ...BitSong,
  ...Ki,
  ...MediBloc,
  ...Bostrom,
  ...Comdex,
  ...Cheqd,
  ...Stargaze,
  ...Chihuahua,
  ...LumNetwork,
  ...Vidulum,
  ...Desmos,
  ...Dig,
  ...Sommelier,
  ...SifChain,
  ...BandChain,
  ...Konstellation,
  ...Umee,
  ...GravityBridge,
  ...Decentr,
  ...Certik,
  ...Carbon,
  ...Injective,
  ...Cerberus,
  ...FetchAi,
  ...AssetMantle,
  ...Provenance,
  ...Galaxy,
  ...Meme,
  ...Evmos,
  ...Terra,
  ...Rizon,
  ...Kava,
  ...GenesisL1,
  ...Kujira,
  ...Tgrade,
  ...Echelon,
  ...Odin,
  ...Crescent,
  ...LumenX,
  ...Oraichain,
  ...Cudos,
  ...Agoric,
  ...Stride,
  ...Rebus,
  ...Teritori,
  ...Axelar,
  ...MarsProtocol,
};
