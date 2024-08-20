import { Address } from "viem";
import { Network } from "../types/overtime";

type ContractAddresses = { [key in Network]: Address };

export const SPORTS_AMM_CONTRACT_ADDRESS: ContractAddresses = {
  [Network.Optimism]: '0x170a5714112daEfF20E798B6e92e25B86Ea603C1',
  [Network.Arbitrum]: '0xae56177e405929c95e5d4b04c0c87e428cb6432b',
  [Network.Base]: '0xafd339acf24813e8038bfdf19a8d87eb94b4605d',
};

export const PARLAY_AMM_CONTRACT_ADDRESS: ContractAddresses = {
  [Network.Optimism]: '0x82B3634C0518507D5d817bE6dAb6233ebE4D68D9',
  [Network.Arbitrum]: '0x2bb7d689780e7a34dd365359bd7333ab24903268',
  [Network.Base]: '0x5625c3233b52206a5f23c5fc1ce16f6a7e3874dd',
};

export const httpProviders: { [key in Network]: string } = {
  [Network.Optimism]: 'https://optimism.meowrpc.com',
  [Network.Arbitrum]: 'https://arb-pokt.nodies.app',
  [Network.Base]: 'https://1rpc.io/base',
}

export const QUOTING_CONTRACT_ADDRESS = '0x6F5A76423396Bf39F64F8c51C0B3dEb24990b116';

export const SLIPPAGE = 0.02;

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';