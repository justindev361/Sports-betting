import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import useAppContext from "@/lib/hooks/useAppContext";
import { getLeaderboard, getTokenPrice } from "@/lib/api/overtime";
import {
  USD_SIGN,
  getRewardsArray,
  getRewardsCurrency,
} from "@/lib/constants/ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronUp,
  faChevronDown,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

import {
  CombinedMarket,
  ParlayMarket,
  ParlayMarketWithQuotes,
  PositionData,
} from "@/lib/types/market";
import {
  convertPositionNameToPositionType,
  extractCombinedMarketsFromParlayMarketType,
  fixPlayerPropsLinesFromContract,
  formatMarketOdds,
  getParlayItemStatus,
  getSpreadTotalText,
  getSymbolText,
  removeCombinedMarketsFromParlayMarketType,
  syncPositionsAndMarketsPerContractOrderInParlay,
} from "@/lib/utils/markets";
import { fixOneSideMarketCompetitorName } from "@/lib/utils/general";
import { BetTypeNameMap } from "@/lib/constants/tags";
import { BetType, OddsType } from "@/lib/enums/markets";

import RankingIcon from "./ranking.svg";
import AvatarIcon from "./avatar.svg";
// import { Spinner } from "@nextui-org/react";

const RankingTable: React.FC = () => {
  const {
    data: { network, odds },
  } = useAppContext();
  const [leaderData, setLeaderData] = useState<any[]>();
  const [loading, setLoading] = useState(false);

  const rewards = getRewardsArray(network);
  const rewardsCurrency = getRewardsCurrency(network);

  const [opens, setOpens] = useState(Array(10).fill(0));
  const [priceAttribute, setPriceAttributes] = useState({});
  const [priceLoading, setPriceLoading] = useState(false);

  const setCloseAndOpen = useCallback((index: number) => {
    const currentValue = opens[index];
    setOpens(opens.fill(0));
    const anotherOpen = opens;
    anotherOpen[index] = !currentValue;
    setOpens([...anotherOpen]);
  }, []);

  useEffect(() => {
    (async () => {
      setPriceLoading(true);
      if (network) {
        const { data: priceData, address } = await getTokenPrice(network);
        const tokenPrice = priceData.attributes.token_prices;
        setPriceAttributes(tokenPrice[address]);
        setPriceLoading(false);
      }
    })();
  }, [network]);

  useEffect(() => {
    if (network) {
      setLoading(true);
      try {
        (async function () {
          const data = await getLeaderboard(network);
          setLeaderData(data);
          setLoading(false);
        })();
      } catch (_) { }
    }
  }, [network]);

  const tableRows = useMemo(() => {
    return leaderData?.slice(0, 10).map((item, index) => {
      return (
        <TableRow
          leaderData={item}
          rewards={rewards}
          rewardsCurrency={rewardsCurrency}
          key={`tablerow-${item.id}`}
          opens={opens}
          setCloseAndOpen={setCloseAndOpen}
          index={index}
          priceAttribute={priceAttribute}
        />
      );
    });
  }, [leaderData, opens]);
  return (
    <div className="ranking-table main-border w-full px-2 py-2 rounded-lg">
      <div className="flex-row flex">
        <div></div>
        <div>WALLET</div>
        <div>POINTS</div>
        <div>REWARD</div>
        <div></div>
      </div>
      {(loading || priceLoading) && (
        <div className="loading-text">
          Loading
          {/* <Spinner size="sm" /> */}
        </div>
      )}
      {tableRows}
    </div>
  );
};

export default RankingTable;

const TableRow = ({
  leaderData,
  rewards,
  rewardsCurrency,
  opens,
  setCloseAndOpen,
  index,
  priceAttribute,
}: {
  leaderData: any;
  rewards: any;
  rewardsCurrency: any;
  opens: number[];
  setCloseAndOpen: (index: number) => void;
  index: number;
  priceAttribute: any;
}) => {
  const {
    data: { odds, network },
  } = useAppContext();

  const parlayData = syncPositionsAndMarketsPerContractOrderInParlay(
    leaderData as ParlayMarket
  );

  const combinedMarkets =
    extractCombinedMarketsFromParlayMarketType(parlayData);
  const parlayWithoutCombinedMarkets =
    removeCombinedMarketsFromParlayMarketType(parlayData);
  const selectMatchOdd = useMemo(() => {
    return odds === "decimal"
      ? OddsType.Decimal
      : odds === "american"
        ? OddsType.American
        : OddsType.AMM;
  }, [odds]);

  return (
    <React.Fragment key={leaderData.id}>
      <div className="flex-row flex">
        <div>{leaderData.rank}</div>
        <div>
          <Image src={RankingIcon} alt="ranking" />
          {leaderData.rank < 4 ? <Image src={AvatarIcon} alt="avatar" /> : ""}
          <span>
            {`${leaderData.account.substring(
              0,
              5
            )}...${leaderData.account.substring(
              leaderData.account.length - 4,
              leaderData.account.length
            )}` ?? ""}
          </span>
        </div>
        <div>{leaderData.points.toFixed(2)}</div>
        <div>
          {`${rewards[leaderData.rank - 1]} ${rewardsCurrency} (${USD_SIGN}${(
            (rewards[leaderData.rank - 1] || 0) * (priceAttribute as number)
          ).toFixed(1)})`}
        </div>
        <div>
          <button>
            <FontAwesomeIcon
              icon={faChevronDown}
              onClick={() => setCloseAndOpen(index)}
            />
          </button>
        </div>
      </div>
      {opens[index] ? (
        <div className="expand-row-container">
          {getExpandedRow(
            parlayWithoutCombinedMarkets,
            selectMatchOdd,
            combinedMarkets
          )}
        </div>
      ) : null}
    </React.Fragment>
  );
};

const getExpandedRow = (
  parlayData: ParlayMarketWithQuotes,
  selectedOddsType: OddsType,
  combinedMarketsData: CombinedMarket[]
) => {
  return parlayData.sportMarketsFromContract.map((market, marketIndex) => {
    const position = parlayData.positions.find(
      (position: PositionData) => position.market.address == market
    ) as PositionData;

    position ? fixPlayerPropsLinesFromContract(position.market) : "";

    const positionEnum = convertPositionNameToPositionType(
      position ? position.side : ""
    );

    const symbolText = position
      ? getSymbolText(positionEnum, position.market)
      : "";
    const spreadTotalText = position
      ? getSpreadTotalText(position.market, positionEnum)
      : "";

    return (
      <React.Fragment key={`marketindex-${marketIndex}`}>
        <div className="expanded-row flex">
          <div className="ex-row">
            <FontAwesomeIcon icon={faCircleCheck} className="text-main-color" />
            <span>
              {position.market.isOneSideMarket
                ? fixOneSideMarketCompetitorName(position.market.homeTeam)
                : position.market.playerName === null
                  ? position.market.homeTeam + " vs " + position.market.awayTeam
                  : `${position.market.playerName} (${BetTypeNameMap[position.market.betType as BetType]
                  })`}
            </span>
          </div>

          <div className="flex justify-start ml-3 ex-row">
            <div className="flex span-contain">
              <div className="circle-id">{symbolText}</div>
              {spreadTotalText ? (
                <span className="spread-total-text">{spreadTotalText}</span>
              ) : null}
            </div>
            <span className="ml-5">
              {" "}
              {formatMarketOdds(
                selectedOddsType,
                parlayData.marketQuotes
                  ? parlayData.marketQuotes[marketIndex]
                  : 0
              )}
            </span>
          </div>
          <div className="ex-row ">{getParlayItemStatus(position.market)}</div>
        </div>
      </React.Fragment>
    );
  });
};
