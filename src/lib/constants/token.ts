import { Address } from "viem";
import { ContractAbi } from "web3";
import { ArbitrumTokenType, BaseTokenType, Network, OptimismTokenType, TokenType } from "../types/overtime";
import { ABI } from "../abi";

export interface TokenData {
  name: string
  address: Address
  decimals: number
  abi: ContractAbi
  main?: boolean
}

export type Tokens<T extends string> = { [key in T]: TokenData };

export const tokens: { [key in Network]: Tokens<string> } = {
  [Network.Optimism]: {
    sUSD: {
      name: 'Sync sUSD',
      address: '0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9',
      decimals: 18,
      abi: ABI.erc20Token,
    },
    DAI: {
      name: 'Dai Stablecoin',
      address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
      decimals: 18,
      abi: ABI.erc20Token,
    },
    USDC: {
      name: 'USD coin',
      address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
      decimals: 6,
      abi: ABI.erc20Token,
    },
    USDT: {
      name: 'Tether USD',
      address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
      decimals: 18,
      abi: ABI.erc20Token,
    },
    OP: {
      name: 'Optimism',
      address: '0x4200000000000000000000000000000000000042',
      decimals: 18,
      abi: ABI.erc20Token,
      main: true
    },
    ETH: {
      name: 'Ethereum',
      address: '0x4200000000000000000000000000000000000006',
      decimals: 18,
      abi: ABI.erc20Token,
    },
    WETH: {
      name: 'Wrapped Ether',
      address: '0x4200000000000000000000000000000000000006',
      decimals: 18,
      abi: ABI.erc20Token,
    }
  } as Tokens<OptimismTokenType>,

  [Network.Arbitrum]: {
    USDCe: {
      name: 'USDCe',
      address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      abi: ABI.erc20Token,
      decimals: 6
    },
    USDC: {
      name: 'USDC',
      address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      abi: ABI.erc20Token,
      decimals: 6
    },
    DAI: {
      name: 'DAI',
      address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
      abi: ABI.erc20Token,
      decimals: 18
    },
    USDT: {
      name: 'USDT',
      address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
      abi: ABI.erc20Token,
      decimals: 6,
    },
    ARB: {
      name: 'ARB',
      address: '0x912CE59144191C1204E64559FE8253a0e49E6548',
      abi: ABI.erc20Token,
      decimals: 18,
      main: true
    },
    WETH: {
      name: 'WETH',
      address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      abi: ABI.erc20Token,
      decimals: 18,
    },
    ETH: {
      name: 'ETH',
      address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      abi: ABI.erc20Token,
      decimals: 18,
    }
  } as Tokens<ArbitrumTokenType>,
  [Network.Base]: {
    USDbc: {
      name: 'USDbc',
      address: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
      abi: ABI.erc20Token,
      decimals: 6,
    },
    WETH: {
      name: 'WETH',
      address: '0x4200000000000000000000000000000000000006',
      abi: ABI.erc20Token,
      decimals: 18
    },
    ETH: {
      name: 'ETH',
      address: '0x4200000000000000000000000000000000000006',
      abi: ABI.erc20Token,
      decimals: 18,
      main: true
    }
  } as Tokens<BaseTokenType>,
}

export const defaultTokenDecimals: { [key in Network]: number } = {
  [Network.Optimism]: 18,
  [Network.Arbitrum]: 6,
  [Network.Base]: 6,
}

export const networks = [Network.Optimism, Network.Arbitrum, Network.Base];