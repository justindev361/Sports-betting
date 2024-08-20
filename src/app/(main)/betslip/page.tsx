'use client'

import NoBets from "@/components/NoBets";
import Switch from "@/components/Switch";
import { buyFromAMM, buyFromAMMWithCollateralAndReferrer, buyFromAMMWithETHAndReferrer, buyFromParlay, buyFromParlayWithDifferentCollateralAndReferrer, buyFromParlayWithEth, getBalance, isApproved } from "@/lib/api/betting";
import { pages } from "@/lib/constants/ui";
import useAppContext from "@/lib/hooks/useAppContext";
import { Network, OptimismTokenType } from "@/lib/types/overtime";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useFeeData } from "wagmi";
import BetCard from "./_components/BetCard";
import BetAmountInput from "./_components/BetAmountInput";
import ServiceFee from "./_components/ServiceFee";
import { fromWei } from "@/lib/utils/general";
import JButton from "@/components/Button";

const originTypes = {
  [Network.Optimism]: 'sUSD',
  [Network.Arbitrum]: 'USDCe',
  [Network.Base]: 'USDbc',
}

export default function Page() {
  const { data: { positions, network, betType }, setData, setDataWith } = useAppContext();
  const [betAmount, setBetAmount] = useState('');
  const [betAmounts, setBetAmounts] = useState<{ [key: string]: string | number }>({});
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState({ bet: false, balance: false });
  const [disabled, setDisabled] = useState(true);
  const [approved, setApproved] = useState(true);

  const account = useAccount();
  const router = useRouter();

  const { data } = useFeeData();


  const [tokenType, setTokenType] = useState<any>(originTypes[network]);

  useEffect(() => {
    const init = async () => {
      setLoading(ld => ({ ...ld, balance: true }));
      try {
        const balance = await getBalance({ userAddress: account.address!, network, tokenType });
        setBalance(balance);
      } catch (_) {
        toast('Error occured!');
      }
      setLoading(ld => ({ ...ld, balance: false }));
    }

    if (account.isConnected) {
      init();
    }
  }, [network, account.isConnected, account.address, tokenType]);

  useEffect(() => {
    const setDefaultToken = () => {
      setTokenType(originTypes[network]);
    }

    setDefaultToken();
  }, [network]);

  useEffect(() => {
    const setBuyDisabled = () => {
      if (betType === 'parlay' && positions.length < 2) {
        setDisabled(true);
      } else if (betType === 'single' && Object.values(betAmounts).some(value => +value <= 0)) {
        setDisabled(true);
      } else {
        setDisabled(false);
      }
    }

    setBuyDisabled();
  }, [betType, betAmount, betAmounts, positions]);

  useEffect(() => {
    const checkIfApproved = async () => {
      if (tokenType === 'ETH' || tokenType === 'WETH') {
        setApproved(true);
      } else if (betType === 'parlay') {
        const approved = await isApproved({ userAddress: account.address!, network, buyIn: +betAmount, tokenType: tokenType });
        setApproved(approved);
      } else if (betType === 'single') {
        let amount = 0;
        for (const am of Object.values(betAmounts)) {
          amount += +am;
        }
        const approved = await isApproved({ userAddress: account.address!, network, buyIn: amount, tokenType: tokenType });
        setApproved(approved);
      }
    }

    if (account.isConnected) {
      try {
        checkIfApproved();
      } catch (_) {
        toast('Error occured!');
      }
    }
  }, [account.isConnected, account.address, network, betType, betAmount, betAmounts, tokenType]);

  const setParlayBet = () => {
    setData({ betType: 'parlay' });
  }

  const setSingleBet = () => {
    setData({ betType: 'single' });
  }

  const setSingleQuote = (address: string, amount: string | number) => {
    setBetAmounts(am => ({ ...am, [address]: amount }));
    setDataWith(d => {
      let { positions } = d;
      positions = positions.map(p => p.market.address === address ? { ...p, paid: +amount } : p);
      return { ...d, positions };
    });
  }

  const SingleBetAmountChange = (address: string, amount: number | string, tokenType: OptimismTokenType) => {
    setSingleQuote(address, amount);
    setTokenType(tokenType);
  }

  const ParlayBetAmountChange = (amount: number | string, tokenType: OptimismTokenType) => {
    setBetAmount(amount.toString());
    setTokenType(tokenType);
  }

  const placeBet = async () => {
    if (!account.isConnected) {
      // setData({ connectVisible: true });
      // addClass('.filter-root', 'j-blur');
      return;
    }

    setLoading(loading => ({ ...loading, bet: true }));
    try {
      if (betType === 'single') {
        await buySingleBet();
      }

      if (betType === 'parlay') {
        await buyParlayBet();
      }
      setDataWith(d => ({ ...d, positions: [], mybetsTab: 0 }));
      setTimeout(() => {
        router.push(pages.mybets.path);
      }, 1500);
    } catch (e) {
      toast('Bet not placed!');
    }
    setLoading(loading => ({ ...loading, bet: false }));
  }

  const buySingleBet = async () => {
    if (tokenType === 'sUSD' || tokenType === 'USDCe' || tokenType === 'USDbc') {
      for await (const pos of positions) {
        await buyFromAMM({
          network: network,
          tokenType,
          userAddress: account.address!,
          marketAddress: pos.market.address,
          position: pos.position,
          buyIn: +pos.paid,
        });
      }
    } else if (tokenType === 'ETH' || tokenType === 'WETH') {
      for await (const pos of positions) {
        await buyFromAMMWithETHAndReferrer({
          network: network,
          marketAddress: pos.market.address,
          position: pos.position,
          buyIn: +pos.paid,
          // gasPrice: data!.gasPrice!
        });
      }
    } else {
      for await (const pos of positions) {
        await buyFromAMMWithCollateralAndReferrer({
          network: network,
          userAddress: account.address!,
          marketAddress: pos.market.address,
          position: pos.position,
          buyIn: +pos.paid,
          tokenType,
        });
      }
    }
  }

  const buyParlayBet = async () => {
    if (tokenType === 'sUSD' || tokenType === 'USDCe' || tokenType === 'USDbc') {
      await buyFromParlay({
        network: network,
        userAddress: account.address!,
        tokenType,
        marketAddresses: positions.map(p => p.market.address),
        positions: positions.map(p => p.position),
        buyIn: +betAmount,
        // gasPrice: data!.gasPrice!
      });
    } else if (tokenType === 'ETH' || tokenType === 'WETH') {
      await buyFromParlayWithEth({
        network: network,
        marketAddresses: positions.map(p => p.market.address),
        positions: positions.map(p => p.position),
        buyIn: +betAmount,
        // gasPrice: data!.gasPrice!,
      });
    } else {
      await buyFromParlayWithDifferentCollateralAndReferrer({
        network: network,
        userAddress: account.address!,
        marketAddresses: positions.map(p => p.market.address),
        positions: positions.map(p => p.position),
        buyIn: +betAmount,
        tokenType: tokenType,
      });
    }
  }

  return (
    <div className="betslip-page">
      {positions.length === 0 && <NoBets />}
      {positions.length > 0 && (
        <>
          <div className="bet-type-box">
            <div className="bet-type-label" onClick={setParlayBet}>Parlay</div>
            <Switch selected={betType === 'single'} onChange={selected => selected ? setSingleBet() : setParlayBet()} />
            <div className="bet-type-label" onClick={setSingleBet}>Single</div>
          </div>
          {betType === 'parlay' && (
            <>
              <div className="bet-list">
                {positions.map((p, index) => <BetCard key={index} {...p} />)}
              </div>
              <BetAmountInput value={betAmount} tokenType={tokenType} onChange={(value, tokenType) => ParlayBetAmountChange(value, tokenType)} />
            </>
          )}
          {betType === 'single' && (
            <div className="bet-list">
              {positions.map((p, index) => (
                <div key={index} className='bet-pay-pair'>
                  <BetCard {...p} />
                  <BetAmountInput value={betAmounts[p.market.address] ?? ''} tokenType={tokenType} onChange={(value, tokenType) => SingleBetAmountChange(p.market.address, value, tokenType)} />
                </div>
              ))}
            </div>
          )}

          <div className="available-balance-box">
            <span>Available balance</span>
            {/* {loading.balance && <Spinner size='sm' />} */}
            {loading.balance && <span>Loading</span>}
            {!loading.balance && (
              <div className='right-box'>
                <span className='amount'>{balance.toFixed(4)}</span>
                <span className='currency'>{tokenType}</span>
              </div>
            )}
          </div>
          <ServiceFee value={fromWei(data?.gasPrice ?? 0n, 9)} />
          {/* <PossibleProfit value={13} /> */}
          <JButton onClick={placeBet} className='place-button' loading={loading.bet} disabled={disabled}>
            {!approved && 'APPROVE & PLACE BET'}
            {approved && 'PLACE BET'}
          </JButton>
        </>
      )}
    </div>
  )
}