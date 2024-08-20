"use client";

import './style.scss';

import Image from "next/image";
import bgImage from "./background.svg";
import {
  dateStr,
  marketFilter,
  randomInt,
  teamLogoUrl,
  timeStr,
} from "@/lib/utils/general";
import useAppContext from "@/lib/hooks/useAppContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getMarkets } from "@/lib/api/overtime";
import { Market } from "@/lib/types/overtime";
import { archivo, archivoBlack, bebasNeue } from "@/lib/utils/fonts";

export default function TodayMatch() {
  const {
    data: { network, sport },
    setData,
  } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [market, setMarket] = useState<Market>();

  const [bannerError, setBannerError] = useState(false);

  useEffect(() => {
    (async function loadingData() {
      setLoading(true);
      try {
        const data = await getMarkets(network, { ungroup: true });
        const markets = marketFilter("today", data);
        // console.log(markets);
        // const filterMarkets = markets.filter(item => {
        //   return item.sport ==
        // })
        setMarket(markets[randomInt(0, markets.length)]);
      } catch (_) {
        toast("Error occured!");
      }
      setLoading(false);
    })();
  }, [network]);

  useEffect(() => {
    setBannerError(false);
  }, [sport]);

  const BetClick = () => {
    if (!market) return;

    setData({ sport: market.sport });
    const timer = setInterval(() => {
      const marketCard = document.querySelector(`[data-market-address='${market.address}']`) as HTMLDivElement;
      if (marketCard) {
        marketCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        clearInterval(timer);
      }
    }, 100);
  }

  return (
    <div className="today-match">
      {(!sport || bannerError) && (
        <Image
          src={bgImage}
          alt="bg-image"
          className="today-match-bg"
          fill
          priority
        />
      )}
      {sport && !bannerError && (
        <Image
          src={`./assets/images/banners/${sport.toLowerCase()}.svg`}
          alt="bg-image"
          className="today-match-bg"
          fill
          objectFit='cover'
          priority
          onError={() => setBannerError(true)}
        />
      )}
      <div className="today-match-top">
        <div className="league-name">{market?.leagueName}</div>
        <div className={`date-box ${archivoBlack.className}`}>TODAY</div>
      </div>
      <div className="today-match-bottom">
        <div className="match-info">
          {market && (
            <>
              <Image
                className="team-logo"
                src={teamLogoUrl(
                  market.leagueId,
                  market.leagueName,
                  market.homeTeam
                )}
                alt=""
                width={100}
                height={100}
              />
              <span>VS</span>
              <Image
                className="team-logo"
                src={teamLogoUrl(
                  market.leagueId,
                  market.leagueName,
                  market.awayTeam
                )}
                alt=""
                width={100}
                height={100}
              />
            </>
          )}
        </div>
        <button className="betnow-button" onClick={BetClick}>Bet Now</button>
      </div>
      <div className="main-info">
        <div className={`team-name-container ${bebasNeue.className}`}>
          {market && (
            <>
              <div className="team-name-small">
                {market.homeTeam}
              </div>
              <div className="team-name-small">
                {market.awayTeam}
              </div>
            </>
          )}
        </div>
        <div className="datetime-info">
          {market && (
            <>
              <div className={archivoBlack.className}>
                {dateStr(market.maturityDate)}
              </div>
              <div className={archivo.className}>
                {timeStr(market.maturityDate)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
