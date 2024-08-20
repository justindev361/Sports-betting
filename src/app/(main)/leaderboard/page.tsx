"use client";

import useAppContext from "@/lib/hooks/useAppContext";
import LeaderInfoBox from "@/components/LeaderInfoBox";

import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { getUserOvertimeTransations } from "@/lib/api/overtime";
import { IUserData } from "@/lib/types/userData";

import ReferalCard from "./_components/ReferalCard";
import RankingTable from "./_components/RankingTable";

export default function Page() {
  const {
    data: { network },
  } = useAppContext();
  const myaccount = useAccount();
  const [userData, setUserData] = useState<IUserData>();

  useEffect(() => {
    if (network && myaccount.address) {
      (async () => {
        const data = await getUserOvertimeTransations(
          network,
          myaccount.address
        );
        setUserData(data);
      })();
    }
  }, [network, myaccount.address]);

  const updatedUserData = useMemo(() => {
    const jsonData = {
      totalVolumn: 0,
      trades: 0,
      highest: 0,
      lifetimeWin: 0,
    };
    if (userData) {
      userData.singles.forEach((item) => {
        jsonData.trades++;
        jsonData.totalVolumn += item.amount;
        if (item.status === "WON") {
          jsonData.lifetimeWin++;
          jsonData.highest =
            jsonData.highest < item.amount ? item.amount : jsonData.highest;
        }
      });

      userData.parlays.forEach((item) => {
        jsonData.trades++;
        jsonData.totalVolumn += item.paid;
        if (item.status === "WON") {
          jsonData.lifetimeWin++;
          // if(jsonData.highest )
          jsonData.highest =
            jsonData.highest < item.paid ? item.paid : jsonData.highest;
        }
      });
    }
    return jsonData;
  }, [userData]);
  
  return (
    <div className="leaderboard-page">
      <div className="text-xl mb-2"> General Leaderboard </div>
      {/* <div className="flex justify-between w-full gap-2">
        <LeaderInfoBox
          title="Total Earning"
          info={`${updatedUserData.totalVolumn.toFixed(1)} USD`}
        />
        <LeaderInfoBox
          title="Lifetime Wins"
          info={`${updatedUserData.lifetimeWin}`}
        />
      </div> */}
      {/* <ReferalCard updatedUserData={updatedUserData} /> */}
      <RankingTable />
    </div>
  );
}
