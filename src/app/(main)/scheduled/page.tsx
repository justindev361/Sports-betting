'use client'

import useAppContext from "@/lib/hooks/useAppContext";

import { useEffect, useState } from "react";
import { Market, TimeType } from "@/lib/types/overtime";
import { getMarkets } from "@/lib/api/overtime";
import { marketFilter } from "@/lib/utils/general";
import { toast } from "react-toastify";
import SportList from "../_components/Header/SportList";
import TodayMatch from "./_components/TodayMatch";
import LeagueSelect from "./_components/LeagueSelect";
import NoBets from "@/components/NoBets";
import MarketCard from "./_components/MarketCard";

export default function Page() {
  const {
    data: {
      sport,
      time: filter,
      time,
      network,
      odds,
      leagueId,
      filterMarket,
      status,
    },
  } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [markets, setMarkets] = useState<Market[]>([]);

  useEffect(() => {
    setLoading(true);
    const loadMarket = async () => {
      try {
        let markets = await getMarkets(+network, {
          sport,
          leagueId: leagueId ? +leagueId : undefined,
          ungroup: true,
          _status: status,
        });

        if (status === "open") {
          markets = marketFilter(time as TimeType, markets);
        }

        markets = markets.filter((market) => {
          if (
            market.awayTeam
              .toLowerCase()
              .includes(filterMarket?.toLowerCase() ?? "")
          )
            return true;
          if (
            market.homeTeam
              .toLowerCase()
              .includes(filterMarket?.toLowerCase() ?? "")
          )
            return true;
          return false;
        });

        setMarkets(markets);
        setLoading(false);
      } catch (e) {
        toast("Error occured!");
      }
    };

    loadMarket();

    if (status === "ongoing") {
      const interval = setInterval(() => {
        loadMarket();
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [network, sport, time, status, leagueId, filterMarket]);

  return (
    <div className="scheduled-page">
      <SportList />
      <div className="page-top">
        <TodayMatch />
        <LeagueSelect />
      </div>
      <div className="page-body-outter">
        {loading && (
          <div className="loading-text">
            Loading
          </div>
        )}
        {!loading && markets.length === 0 && <NoBets />}
        <div className="page-body">
          {!loading && markets.length > 0 && (
            markets.map((market) => (
              <MarketCard key={market.address} {...market} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}