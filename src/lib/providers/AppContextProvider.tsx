"use client";

import {
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import {
  BetType,
  Market,
  Network,
  OddsType,
  PositionDto,
  StatusType,
  TimeType,
} from "../types/overtime";
import { compareTime } from "../utils/general";
import { useAccount, useChainId, useDisconnect } from "wagmi";
import { networks } from "../constants/token";
import { toast } from "react-toastify";
import { usePathname } from "next/navigation";
import LoadingBox from "@/components/LoadingBox";

interface ContextData {
  network: Network;
  sport: string;
  status: StatusType;
  odds: OddsType;
  time: TimeType;
  leagueId?: number;
  filterMarket?: string;

  betType: BetType;
  openDetailed: string[];
  favorites: Market[];
  positions: PositionDto[];

  sideBarVisible: boolean;
  mybetsTab: 0 | 1 | 2;
}

const initials: ContextData = {
  network: Network.Optimism,
  sport: "Soccer",
  odds: "decimal",
  time: "all",
  status: "open",
  mybetsTab: 0,
  filterMarket: "",

  sideBarVisible: false,
  betType: "parlay",
  openDetailed: [],
  positions: [],
  favorites: [],
};

export const AppContext = createContext<{
  data: ContextData;
  setData: (data: Partial<ContextData>) => void;
  setDataWith: (value: SetStateAction<ContextData>) => void;
}>({
  data: initials,
  setData: () => {},
  setDataWith: () => {},
});

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState(initials);
  const [firstLoad, setFirstLoad] = useState(true);

  const chainId = useChainId();
  const disconnect = useDisconnect();
  const account = useAccount();

  const pathname = usePathname();

  useEffect(() => {
    if (data !== initials) {
      localStorage.setItem("app-data", JSON.stringify(data));
    }
  }, [data, firstLoad]);

  useEffect(() => {
    const appDataJson = localStorage.getItem("app-data");
    if (appDataJson) {
      const appData = JSON.parse(appDataJson) as ContextData;
      const { positions, favorites } = appData;
      setData({
        ...appData,
        positions: positions.filter(
          (p) => compareTime(p.market.maturityDate, Date()) === 1
        ),
        favorites: favorites.filter(
          (f) => compareTime(f.maturityDate, Date()) === 1
        ),
      });
    }
    setFirstLoad(false);
  }, []);

  useEffect(() => {
    (function ChainIdChange() {
      if (!account.isConnected) {
        return;
      }

      if (networks.includes(chainId)) {
        setData((data) => ({
          ...data,
          network: chainId,
          positions: [],
          favorites: [],
        }));
      } else {
        disconnect.disconnect();
        setTimeout(() => {
          location.href = pathname;
        }, 2000);
        toast("Optimism, Arbitrum and base are only available");
      }
    })();
  }, [account.isConnected, chainId]);

  if (firstLoad) {
    return <LoadingBox />;
  }

  return (
    <AppContext.Provider
      value={{
        data,
        setData: (data) => setData((d) => ({ ...d, ...data })),
        setDataWith: setData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
