"use client";

import './style.scss';

import { getLeagues, getMarkets } from "@/lib/api/overtime";
import useAppContext from "@/lib/hooks/useAppContext";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import SportListButton from "./SportListButton";
import { Market } from "@/lib/types/overtime";
import Skeleton from "react-loading-skeleton";

export default function SportList() {
  const [sports, setSports] = useState<string[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const {
    data: { network, sport: currentSport },
    setData,
  } = useAppContext();

  useEffect(() => {
    (async function loadSports() {
      setLoading(true);
      try {
        const { sports } = await getLeagues(network);
        const markets = await getMarkets(network, { ungroup: true });
        setSports(sports);
        setMarkets(markets);
      } catch (_) {
        toast("Error occured!");
      }
      setLoading(false);
    })();
  }, [network]);

  const orderSports = useMemo(() => {
    if (sports) {
      const newItems = sports;

      newItems.forEach((item: any, i) => {
        if (item == "Soccer") {
          newItems.splice(i, 1);
          newItems.unshift(item);
        }
      });

      return newItems;
    }
    return [];
  }, [sports]);

  useEffect(() => {
    const currentButton = document.querySelector(`[data-sport=${currentSport}]`) as HTMLDivElement;
    currentButton?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSport]);

  return (
    <div className="sport-list">
      {loading && <Skeleton className="sport-list-skeleton" />}
      {!loading && (
        <div className="sport-list-content">
          {orderSports.map((sport) => (
            <SportListButton
              key={sport}
              title={sport}
              count={markets.filter((market) => market.sport === sport).length}
              onClick={() => setData({ sport, leagueId: undefined })}
              selected={sport === currentSport}
            />
          ))}
        </div>
      )}
    </div>
  );
}
