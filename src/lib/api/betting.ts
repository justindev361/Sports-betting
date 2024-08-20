import { Address } from "viem";
import { Field, Network, TokenType } from "../types/overtime";
import { readContract, writeContract } from '@wagmi/core';
import { defaultTokenDecimals, tokens } from "../constants/token";
import { ADDRESS_ZERO, PARLAY_AMM_CONTRACT_ADDRESS, QUOTING_CONTRACT_ADDRESS, SLIPPAGE, SPORTS_AMM_CONTRACT_ADDRESS, httpProviders } from "../constants/betting";
import { ethers } from "ethers";
import { fromWei, toWei } from "../utils/general";
import { getParlayQuote, getSingleQuote } from "./overtime";
import { ABI } from "../abi";
import Web3 from "web3";
import { config } from "@/wallet-connect/config";

type GetBalance = (data: {
  userAddress: Address
  network: Network
  tokenType: TokenType
}) => Promise<number>;

type IsApproved = (data: {
  userAddress: Address
  network: Network
  tokenType: TokenType
  buyIn: number
}) => Promise<boolean>;

type ConfirmApproved = (data: {
  userAddress: Address
  network: Network
  tokenType: TokenType
  buyIn: number
}) => Promise<void>;

type BuyFromAMM = (data: {
  userAddress: Address
  network: Network
  marketAddress: Address
  position: Field
  tokenType: TokenType
  buyIn: number
}) => Promise<void>;

type BuyFromAMMWithCollateralAndReferrer = (data: {
  userAddress: Address
  network: Network
  marketAddress: Address
  position: Field
  tokenType: TokenType
  buyIn: number
}) => Promise<void>;

type BuyFromAMMWithETHAndReferrer = (data: {
  network: Network
  marketAddress: Address
  position: Field
  buyIn: number
}) => Promise<void>;

type ETHtoUSD = (etherAmount: number) => Promise<number>;

type BuyFromParlay = (data: {
  userAddress: Address
  network: Network
  marketAddresses: Address[]
  positions: Field[]
  tokenType: TokenType
  buyIn: number
}) => Promise<void>

type BuyFromParlayWithDifferentCollateralAndReferrer = (data: {
  userAddress: Address
  network: Network
  marketAddresses: Address[]
  positions: Field[]
  tokenType: TokenType
  buyIn: number
}) => Promise<void>;

type BuyFromParlayWithEth = (data: {
  network: Network
  marketAddresses: Address[]
  positions: Field[]
  buyIn: number
}) => Promise<void>;

export const getBalance: GetBalance = async ({ userAddress, network, tokenType }) => {
  if (tokenType === 'ETH') {
    const web3provider = new Web3.providers.HttpProvider(httpProviders[network]);
    const web3 = new Web3(web3provider);
    const data = await web3.eth.getBalance(userAddress);
    const balance = fromWei(data);
    return balance;
  }

  const token = tokens[network][tokenType];
  if (!token) {
    return 0;
  }

  // const result = await readContract({
  //   address: token.address,
  //   abi: token.abi,
  //   functionName: 'balanceOf',
  //   args: [userAddress],
  // }) as bigint;

  const result = await readContract(config, {
    address: token.address,
    abi: token.abi,
    functionName: 'balanceOf',
    args: [userAddress],
  }) as bigint;

  const balance = fromWei(result, token.decimals);
  return balance;
}

export const isApproved: IsApproved = async ({ userAddress, network, tokenType, buyIn }) => {
  const token = tokens[network][tokenType];
  if (!token) {
    return false;
  }

  const allowance = await readContract(config, {
    address: token.address,
    abi: token.abi,
    functionName: 'allowance',
    args: [userAddress, SPORTS_AMM_CONTRACT_ADDRESS[network]],
  }) as bigint;

  return toWei(buyIn, token.decimals) <= allowance;
}

export const confirmApproved: ConfirmApproved = async (data) => {
  const approved = await isApproved(data);
  if (!approved) {
    const { network, tokenType, buyIn } = data;
    const token = tokens[network][tokenType];
    // const config = await prepareWriteContract({
    //   address: token.address,
    //   abi: token.abi,
    //   functionName: 'approve',
    //   args: [SPORTS_AMM_CONTRACT_ADDRESS[network], toWei(buyIn, token.decimals)]
    // });
    // await writeContract(config);
    await writeContract(config, {
      address: token.address,
      abi: token.abi,
      functionName: 'approve',
      args: [SPORTS_AMM_CONTRACT_ADDRESS[network], toWei(buyIn, token.decimals)]
    })
  }
}

export const buyFromAMM: BuyFromAMM = async ({ userAddress, network, marketAddress, position, tokenType, buyIn }) => {
  await confirmApproved({ userAddress, network, tokenType, buyIn });

  const quote = await getSingleQuote(network, marketAddress, position, buyIn);
  const parsedPayout = ethers.parseEther(quote.payout.toString());
  const parsedActualBuyInCollateralAmount = ethers.parseEther(quote.actualBuyInCollateralAmount.toString());
  const parasedSlippage = ethers.parseEther(SLIPPAGE.toString());

  // const config = await prepareWriteContract({
  //   address: SPORTS_AMM_CONTRACT_ADDRESS[network],
  //   abi: ABI.sportsAMM,
  //   functionName: 'buyFromAMM',
  //   args: [marketAddress, position, parsedPayout, parsedActualBuyInCollateralAmount, parasedSlippage],
  // });
  await writeContract(config, {
    address: SPORTS_AMM_CONTRACT_ADDRESS[network],
    abi: ABI.sportsAMM,
    functionName: 'buyFromAMM',
    args: [marketAddress, position, parsedPayout, parsedActualBuyInCollateralAmount, parasedSlippage],
  });
}

export const ethToUSD: ETHtoUSD = async (etherAmount) => {
  const web3provider = new Web3.providers.HttpProvider(httpProviders[Network.Optimism]);
  const web3 = new Web3(web3provider);
  const contract = new web3.eth.Contract(ABI.quotingContract, QUOTING_CONTRACT_ADDRESS);
  const result = await contract.methods.getMaximumReceived(tokens[Network.Optimism].ETH.address, ethers.parseEther(etherAmount.toString())).call() as bigint;
  return fromWei(result, 18) * 0.95; // slippage = 0.05
}

export const buyFromAMMWithETHAndReferrer: BuyFromAMMWithETHAndReferrer = async ({ network, marketAddress, position, buyIn }) => {
  const usdAmount = await ethToUSD(buyIn);
  const quote = await getSingleQuote(network, marketAddress, position, usdAmount);

  const parsedPayout = ethers.parseEther(quote.payout.toString());
  const parsedActualBuyInCollateralAmount = ethers.parseEther(buyIn.toString());
  const parasedSlippage = ethers.parseEther(SLIPPAGE.toString());

  // const config = await prepareWriteContract({
  //   address: SPORTS_AMM_CONTRACT_ADDRESS[network],
  //   abi: ABI.sportsAMM,
  //   functionName: 'buyFromAMMWithEthAndReferrer',
  //   args: [marketAddress, position, parsedPayout, parsedActualBuyInCollateralAmount, parasedSlippage, tokens[network].ETH.address, ADDRESS_ZERO],
  //   value: ethers.parseEther(buyIn.toString()),
  // });
  await writeContract(config, {
    address: SPORTS_AMM_CONTRACT_ADDRESS[network],
    abi: ABI.sportsAMM,
    functionName: 'buyFromAMMWithEthAndReferrer',
    args: [marketAddress, position, parsedPayout, parsedActualBuyInCollateralAmount, parasedSlippage, tokens[network].ETH.address, ADDRESS_ZERO],
    value: ethers.parseEther(buyIn.toString()),
  });
}

export const buyFromAMMWithCollateralAndReferrer: BuyFromAMMWithCollateralAndReferrer = async ({
  userAddress, network, marketAddress, position, tokenType, buyIn,
}) => {
  await confirmApproved({ userAddress, network, tokenType, buyIn });
  const quote = await getSingleQuote(network, marketAddress, position, buyIn);
  const parsedPayout = ethers.parseEther(quote.payout.toString());
  const parsedActualBuyInCollateralAmount = ethers.parseEther(quote.actualBuyInCollateralAmount.toString());
  const parasedSlippage = ethers.parseEther(SLIPPAGE.toString());

  // const buyConfig = await prepareWriteContract({
  //   address: SPORTS_AMM_CONTRACT_ADDRESS[network],
  //   abi: ABI.sportsAMM,
  //   functionName: 'buyFromAMMWithDifferentCollateral',
  //   args: [marketAddress, position, parsedPayout, parsedActualBuyInCollateralAmount, parasedSlippage, tokens[network][tokenType].address],
  // });
  await writeContract(config, {
    address: SPORTS_AMM_CONTRACT_ADDRESS[network],
    abi: ABI.sportsAMM,
    functionName: 'buyFromAMMWithDifferentCollateral',
    args: [marketAddress, position, parsedPayout, parsedActualBuyInCollateralAmount, parasedSlippage, tokens[network][tokenType].address],
  });
}

export const buyFromParlay: BuyFromParlay = async ({ userAddress, network, marketAddresses, positions, tokenType, buyIn }) => {
  await confirmApproved({ userAddress, network, tokenType, buyIn });

  const quote = await getParlayQuote(network, marketAddresses, positions, buyIn);
  const parsedPayout = ethers.parseEther((quote.payout * 0.99).toString());
  const parasedSlippage = ethers.parseEther(SLIPPAGE.toString());

  const token = tokens[network][tokenType];

  // const config = await prepareWriteContract({
  //   address: PARLAY_AMM_CONTRACT_ADDRESS[network],
  //   abi: ABI.parlayAMM,
  //   functionName: 'buyFromParlay',
  //   args: [marketAddresses, positions, toWei(buyIn, token.decimals), parasedSlippage, parsedPayout, ADDRESS_ZERO],
  //   // value: toWei(buyIn, token.decimals),
  // });
  await writeContract(config, {
    address: PARLAY_AMM_CONTRACT_ADDRESS[network],
    abi: ABI.parlayAMM,
    functionName: 'buyFromParlay',
    args: [marketAddresses, positions, toWei(buyIn, token.decimals), parasedSlippage, parsedPayout, ADDRESS_ZERO],
    // value: toWei(buyIn, token.decimals),
  });
}

export const buyFromParlayWithDifferentCollateralAndReferrer: BuyFromParlayWithDifferentCollateralAndReferrer = async ({
  userAddress, network, marketAddresses, positions, tokenType, buyIn,
}) => {
  await confirmApproved({ userAddress, network, tokenType, buyIn });

  const quote = await getParlayQuote(network, marketAddresses, positions, buyIn);
  const parsedPayout = ethers.parseEther(quote.payout.toString());
  const parsedActualBuyInCollateralAmount = ethers.parseEther(quote.actualBuyInCollateralAmount.toString());
  const parasedSlippage = ethers.parseEther(SLIPPAGE.toString());

  // const buyConfig = await prepareWriteContract({
  //   address: PARLAY_AMM_CONTRACT_ADDRESS[network],
  //   abi: ABI.parlayAMM,
  //   functionName: 'buyFromParlayWithDifferentCollateralAndReferrer',
  //   args: [marketAddresses, positions, parsedPayout, parsedActualBuyInCollateralAmount, parasedSlippage, tokens[network][tokenType].address, ADDRESS_ZERO],
  // });
  await writeContract(config, {
    address: PARLAY_AMM_CONTRACT_ADDRESS[network],
    abi: ABI.parlayAMM,
    functionName: 'buyFromParlayWithDifferentCollateralAndReferrer',
    args: [marketAddresses, positions, parsedPayout, parsedActualBuyInCollateralAmount, parasedSlippage, tokens[network][tokenType].address, ADDRESS_ZERO],
  });
}

export const buyFromParlayWithEth: BuyFromParlayWithEth = async ({ network, marketAddresses, positions, buyIn }) => {
  const usdAmount = await ethToUSD(buyIn);

  const quote = await getParlayQuote(network, marketAddresses, positions, usdAmount);
  const parsedPayout = ethers.parseEther(quote.payout.toString());
  const parasedSlippage = ethers.parseEther(SLIPPAGE.toString());

  // const config = await prepareWriteContract({
  //   address: PARLAY_AMM_CONTRACT_ADDRESS[network],
  //   abi: ABI.parlayAMM,
  //   functionName: 'buyFromParlayWithEth',
  //   args: [marketAddresses, positions, toWei(usdAmount, defaultTokenDecimals[network]), parasedSlippage, parsedPayout, tokens[network].ETH.address, ADDRESS_ZERO],
  //   value: toWei(buyIn),
  // });
  await writeContract(config, {
    address: PARLAY_AMM_CONTRACT_ADDRESS[network],
    abi: ABI.parlayAMM,
    functionName: 'buyFromParlayWithEth',
    args: [marketAddresses, positions, toWei(usdAmount, defaultTokenDecimals[network]), parasedSlippage, parsedPayout, tokens[network].ETH.address, ADDRESS_ZERO],
    value: toWei(buyIn),
  });
}


export const claimSingle = async (marketAddress: Address) => {
  // const config = await prepareWriteContract({
  //   address: marketAddress,
  //   abi: ABI.singleMarket,
  //   functionName: 'exerciseOptions',
  // });
  await writeContract(config, {
    address: marketAddress,
    abi: ABI.singleMarket,
    functionName: 'exerciseOptions',
  });
}

export const claimParlay = async (network: Network, marketAddress: Address) => {
  // const config = await prepareWriteContract({
  //   address: PARLAY_AMM_CONTRACT_ADDRESS[network],
  //   abi: ABI.parlayAMM,
  //   functionName: 'exerciseParlay',
  //   args: [marketAddress],
  // });
  await writeContract(config, {
    address: PARLAY_AMM_CONTRACT_ADDRESS[network],
    abi: ABI.parlayAMM,
    functionName: 'exerciseParlay',
    args: [marketAddress],
  });
}