'use client'

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import { Position, PositionType } from "@/lib/types/overtime";
import { getPositions, getUserOvertimeTransations } from "@/lib/api/overtime";
import useAppContext from "@/lib/hooks/useAppContext";
import { networks } from "@/lib/constants/token";
import TabBox from "./_components/TabBox/TabBox";
import PositionBox from "./_components/PositionBox";
import ClosedSingleCard from "./_components/ClosedCard/ClosedSingleCard";
import ClosedParlayCard from "./_components/ClosedCard/ClosedParlayCard";
import OpenSingleCard from "./_components/OpenCard/OpenParlayCard";
import OpenParlayCard from "./_components/OpenCard/OpenParlayCard";
import { IUserData } from "@/lib/types/userData";
import LeaderInfoBox from "@/components/LeaderInfoBox";
import ReferalCard from "../leaderboard/_components/ReferalCard";

type Result = { [key in PositionType]: Position[] };
const initial: Result = {
  singles: [],
  parlays: [],
}

export default function Page() {
  const [loading, setLoading] = useState({ open: true, closed: true, claimable: true });
  const [openPositions, setOpenPositions] = useState<Result>(initial);
  const [closedPositions, setClosedPositions] = useState<Result>(initial);
  const [claimablePositions, setClaimablePositions] = useState<Result>(initial);
  const [userData, setUserData] = useState<IUserData>();

  const { data: { network, mybetsTab }, setData } = useAppContext();

  const account = useAccount();
  const pathname = usePathname();

  const userAddress = account.address;

  useEffect(() => {
    // if (account.status !== 'reconnecting' && !account.isConnected && pathname === pages.mybets.path) {
    //   setData({ connectVisible: true });
    //   addClass('.filter-root', 'j-blur');
    // }
  }, [account.isConnected, account.status, pathname]);

  useEffect(() => {
    if (account.status === 'connected' && userAddress && networks.includes(network)) {
      setLoading({ open: true, closed: true, claimable: true });

      getPositions(network, userAddress, { status: 'open' }).then(data => {
        setOpenPositions(data);
        setLoading(loading => ({ ...loading, open: false }));
      });
      getPositions(network, userAddress, { status: 'closed' }).then(data => {
        setClosedPositions(data);
        setLoading(loading => ({ ...loading, closed: false }));
      });
      getPositions(network, userAddress, { status: 'claimable' }).then(data => {
        setClaimablePositions(data);
        setLoading(loading => ({ ...loading, claimable: false }));
      });
    } else {
      setOpenPositions(initial);
      setClosedPositions(initial);
      setClaimablePositions(initial);
      setLoading({ open: false, closed: false, claimable: false });
    }
  }, [userAddress, network, account.status]);

  useEffect(() => {
    if (network && account.address) {
      (async () => {
        const data = await getUserOvertimeTransations(
          network,
          account.address
        );
        setUserData(data);
      })();
    }
  }, [network, account.address]);

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
    <div className="mybets-page">
      <div className="dashboard">
        <div className="flex justify-between w-full gap-2">
          <LeaderInfoBox
            title="TOTAL VOLUME"
            info={`${updatedUserData.totalVolumn.toFixed(1)} USD`}
          />
          <LeaderInfoBox
            title="HIGHEST WIN"
            info={`${updatedUserData.highest.toFixed(1)} USD`}
          />
        </div>
        <ReferalCard updatedUserData={updatedUserData} />
      </div>

      <TabBox tabs={[
        {
          title: 'Open',
          widget: <PositionBox positions={openPositions} loading={loading.open} SingleCard={OpenSingleCard} ParlayCard={OpenParlayCard} />,
        },
        {
          title: 'Closed',
          widget: <PositionBox positions={closedPositions} loading={loading.closed} SingleCard={ClosedSingleCard} ParlayCard={ClosedParlayCard} />,
        },
        {
          title: 'Claimable',
          badgeText: (claimablePositions.singles.length + claimablePositions.parlays.length) > 0 ? (claimablePositions.singles.length + claimablePositions.parlays.length).toString() : undefined,
          widget: <PositionBox positions={claimablePositions} loading={loading.claimable} SingleCard={ClosedSingleCard} ParlayCard={ClosedParlayCard} />,
        },
      ]}
        selectedId={mybetsTab}
        setSelectedId={(id) => setData({ mybetsTab: id as any })}
      />
    </div>
  )
}