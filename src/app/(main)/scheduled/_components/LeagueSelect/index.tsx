"use client";

import './style.scss';

import JSelect from "@/components/Select";
import { getLeagues, getMarkets } from "@/lib/api/overtime";
import useAppContext from "@/lib/hooks/useAppContext";
import {
  TimeType,
  League,
  Market,
  OddsType,
  StatusType,
} from "@/lib/types/overtime";
// import { Select, SelectItem } from "@nextui-org/react";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

const statusList: { title: string; value: StatusType }[] = [
  { title: "Open", value: "open" },
  { title: "Ongoing", value: "ongoing" },
  { title: "Finished", value: "resolved" },
  { title: "Canceled", value: "canceled" },
  { title: "Paused", value: "paused" },
];

const oddsList: { title: string; value: OddsType }[] = [
  { title: "American", value: "american" },
  { title: "Decimal", value: "decimal" },
  { title: "Normalized", value: "normalizedImplied" },
];

const timeList: { title: string; value: TimeType }[] = [
  { title: "All", value: "all" },
  { title: "Today", value: "today" },
  { title: "In 1h", value: "in-1h" },
];

export default function LeagueSelect() {
  const {
    data: { network, leagueId, sport, odds, time, status },
    setData,
  } = useAppContext();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      (async function loadSport() {
        setLoading(true);
        const { leagues } = await getLeagues(network);
        setLeagues(leagues);
        const markets = await getMarkets(network, { ungroup: true });
        setMarkets(markets);
        setLoading(false);
      })();
    } catch (_) {
      setLoading(false);
      toast("Error occured!");
    }
  }, [network]);

  const LeagueChange = (value: string) => {
    if (value === "ALL") {
      setData({ leagueId: undefined });
    } else {
      setData({ leagueId: +value });
    }
  };

  const TimeChange = (value: string) => {
    setData({ time: value as any });
  };

  const OddsChange = (value: string) => {
    setData({ odds: value as any });
  };

  const StatusChange = (value: string) => {
    setData({ status: value as any });
  };

  return (
    <div className="league-select">
      <div className="league-top-part">
        <div className="sport-title-box">{sport}</div>
        <button
          className="view-all-button"
          onClick={() => setData({ leagueId: undefined, time: "all" })}
        >
          View all
        </button>
      </div>
      {/* <div className="league-select-icons-parts flex justify-between">
        {Icons.map((icon, index) => {
          return (
            <div key={`league-icon-${index}`}>
              <Image src={icon} alt="icon" />
            </div>
          );
        })}
      </div> */}
      <div className="league-select-part">
        <JSelect
          items={[
            { text: `All (${markets.filter(m => m.sport === sport).length})`, value: 'ALL' },
            ...leagues
              .filter(l => l.sport === sport)
              .map(l => ({ text: `${l.name} (${markets.filter(m => m.leagueId === l.id).length})`, value: l.id.toString() }))
          ]}
          value={leagueId ? leagueId.toString() : 'ALL'}
          onChange={LeagueChange}
        />

        <div className="filter-box">
          <JSelect
            items={statusList.map(ft => ({ text: ft.title, value: ft.value }))}
            onChange={StatusChange}
            value={status}
          />

          <JSelect
            items={oddsList.map(odd => ({ text: odd.title, value: odd.value }))}
            onChange={OddsChange}
            value={odds}
          />

          <JSelect
            items={timeList.map(time => ({ text: time.title, value: time.value }))}
            onChange={TimeChange}
            value={time}
          />
        </div>
      </div>
    </div>
  );
}
