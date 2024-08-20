import { format } from 'date-fns';
import numbro from 'numbro';

import { SPORTS_TAGS_MAP } from "../constants/tags";
import { BetType, DoubleChanceMarketType, ONE_SIDER_PLAYER_PROPS_BET_TYPES, OddsType, PLAYER_PROPS_BET_TYPES, Position, SPECIAL_YES_NO_BET_TYPES } from "../enums/markets";
import { CombinedMarket, CombinedMarketsPositionName, MarketData, ParlayMarket, ParlayMarketWithQuotes, PositionData, SportMarketInfo } from "../types/market";
import { DEFAULT_CURRENCY_DECIMALS } from '../constants/currency';

type NumericValue = string | number;

export const syncPositionsAndMarketsPerContractOrderInParlay = (parlayMarket: ParlayMarket): ParlayMarketWithQuotes => {
    const syncedParlayMarket: ParlayMarketWithQuotes = { ...parlayMarket, quotes: [] };

    const positions: PositionData[] = [];
    const markets: SportMarketInfo[] = [];
    const quotes: number[] = [];

    parlayMarket.sportMarketsFromContract.forEach((address, index) => {
        const position = parlayMarket.positions.find((position) => position.market.address == address);
        const market = parlayMarket.sportMarkets.find((market) => market.address == address);

        if (position && market) {
            position.market = market;
            position.market.isOneSideMarket = getIsOneSideMarket(Number(market.tags[0]));

            positions.push(position);
            markets.push(market);

            const quote = market.isCanceled || !parlayMarket.marketQuotes ? 1 : parlayMarket.marketQuotes[index];
            quotes.push(quote);
        }
    });

    syncedParlayMarket.sportMarkets = markets;
    syncedParlayMarket.positions = positions;
    syncedParlayMarket.quotes = quotes;

    return syncedParlayMarket;
};


export const extractCombinedMarketsFromParlayMarketType = (parlayMarket: ParlayMarketWithQuotes): CombinedMarket[] => {
    const combinedMarkets = [];
    const sportMarkets = parlayMarket.sportMarkets;
    for (let i = 0; i < sportMarkets.length - 1; i++) {
        for (let j = i + 1; j < parlayMarket.sportMarkets.length; j++) {
            if (isParentMarketSameForSportMarkets(sportMarkets[i], sportMarkets[j])) {
                const firstPositionData = parlayMarket.positions[i];
                const secondPositionData = parlayMarket.positions[j];
                const firstPositionOdd = parlayMarket.quotes[i];
                const secondPositionOdd = parlayMarket.quotes[j];

                combinedMarkets.push({
                    markets: [sportMarkets[i], sportMarkets[j]],
                    positions: [
                        convertPositionNameToPositionType(firstPositionData.side),
                        convertPositionNameToPositionType(secondPositionData.side),
                    ],
                    totalOdd: calculateCombinedMarketOddBasedOnHistoryOdds([firstPositionOdd, secondPositionOdd]),
                    totalBonus: 0,
                    positionName: getCombinedPositionName(
                        [sportMarkets[i], sportMarkets[j]],
                        [
                            convertPositionNameToPositionType(firstPositionData.side),
                            convertPositionNameToPositionType(secondPositionData.side),
                        ]
                    ),
                });
            }
        }
    }
    return combinedMarkets;
};


export const getCombinedPositionName = (
    markets: SportMarketInfo[],
    positions: Position[]
): CombinedMarketsPositionName | null => {
    if (markets[0].betType == BetType.WINNER && markets[1].betType == BetType.TOTAL) {
        if (positions[0] == 0 && positions[1] == 0) return '1&O';
        if (positions[0] == 0 && positions[1] == 1) return '1&U';
        if (positions[0] == 1 && positions[1] == 0) return '2&O';
        if (positions[0] == 1 && positions[1] == 1) return '2&U';
        if (positions[0] == 2 && positions[1] == 0) return 'X&O';
        if (positions[0] == 2 && positions[1] == 1) return 'X&U';
    }

    if (markets[0].betType == BetType.SPREAD && markets[1].betType == BetType.TOTAL) {
        if (positions[0] == 0 && positions[1] == 0) return 'H1&O';
        if (positions[0] == 0 && positions[1] == 1) return 'H1&U';
        if (positions[0] == 1 && positions[1] == 0) return 'H2&O';
        if (positions[0] == 1 && positions[1] == 1) return 'H2&U';
    }
    return null;
};


const calculateCombinedMarketOddBasedOnHistoryOdds = (odds: number[]) => {
    let totalOdd = 1;

    odds.forEach((odd) => (odd ? (totalOdd *= odd) : ''));

    if (totalOdd == 1) return 0;
    return totalOdd;
};



export const convertPositionNameToPositionType = (positionName: string) => {
    if (positionName?.toUpperCase() == 'HOME') return Position.HOME;
    if (positionName?.toUpperCase() == 'AWAY') return Position.AWAY;
    if (positionName?.toUpperCase() == 'DRAW') return Position.DRAW;
    return Position.HOME;
};



export const isParentMarketSameForSportMarkets = (
    firstMarket: SportMarketInfo,
    secondMarket: SportMarketInfo
): boolean => {
    if (isPlayerProps(firstMarket.betType) || isPlayerProps(secondMarket.betType)) return false;
    if (firstMarket.parentMarket && secondMarket.parentMarket) {
        return firstMarket.parentMarket == secondMarket.parentMarket;
    }

    if (!firstMarket.parentMarket && secondMarket.parentMarket) {
        return firstMarket.address == secondMarket.parentMarket;
    }

    if (firstMarket.parentMarket && !secondMarket.parentMarket) {
        return firstMarket.parentMarket == secondMarket.address;
    }

    return false;
};

export const isPlayerProps = (betType: BetType) => {
    return PLAYER_PROPS_BET_TYPES.includes(betType);
};


export const removeCombinedMarketsFromParlayMarketType = (
    parlayMarket: ParlayMarketWithQuotes
): ParlayMarketWithQuotes => {
    const combinedMarkets = extractCombinedMarketsFromParlayMarketType(parlayMarket);

    if (!combinedMarkets.length) return parlayMarket;

    const _parlay = { ...parlayMarket };

    const _quotes: number[] = [];
    const _markets: SportMarketInfo[] = [];
    const _positions: PositionData[] = [];
    const _sportMarketAddresses: string[] = [];
    const _marketQuotes: number[] = [];

    _parlay.sportMarkets.forEach((market, index) => {
        const sameMarket = combinedMarkets.find(
            (combinedMarket) =>
                combinedMarket.markets[0].address == market.address ||
                combinedMarket.markets[1].address == market.address
        );

        if (!sameMarket) {
            _quotes.push(_parlay.quotes[index]);
            _markets.push(_parlay.sportMarkets[index]);
            _positions.push(_parlay.positions[index]);
            _marketQuotes.push(_parlay.marketQuotes[index]);
            _sportMarketAddresses.push(_parlay.sportMarketsFromContract[index]);
        }
    });

    _parlay.sportMarkets = _markets;
    _parlay.sportMarketsFromContract = _sportMarketAddresses;
    _parlay.positions = _positions;
    _parlay.quotes = _quotes;
    _parlay.marketQuotes = _marketQuotes;

    return _parlay;
};


export const getSpreadTotalText = (market: SportMarketInfo | MarketData, position: Position) => {
    if (market.betType === BetType.SPREAD)
        return position === Position.HOME
            ? `${Number(market.spread) > 0 ? '+' : '-'}${Math.abs(Number(market.spread)) / 100}`
            : `${Number(market.spread) > 0 ? '-' : '+'}${Math.abs(Number(market.spread)) / 100}`;

    if (market.betType === BetType.TOTAL) return `${Number(market.total) / 100}`;
    if (isPlayerProps(market.betType)) return `${Number(market.playerPropsLine)}`;
    return undefined;
};

// export const convertPositionNameToPositionType = (positionName: string) => {
//     if (positionName?.toUpperCase() == 'HOME') return Position.HOME;
//     if (positionName?.toUpperCase() == 'AWAY') return Position.AWAY;
//     if (positionName?.toUpperCase() == 'DRAW') return Position.DRAW;
//     return Position.HOME;
// };

export const fixPlayerPropsLinesFromContract = (market: SportMarketInfo | MarketData) => {
    Number(market.playerPropsLine) % 1 == 0 ? (market.playerPropsLine = Number(market.playerPropsLine) / 100) : '';
};


export const getSymbolText = (
    position: Position,
    market: SportMarketInfo | MarketData,
    combinedMarketPositionSymbol?: CombinedMarketsPositionName
) => {
    const betType = Number(market.betType);
    if (combinedMarketPositionSymbol) {
        return combinedMarketPositionSymbol;
    }

    if (market.isOneSideMarket || isOneSidePlayerProps(Number(betType))) {
        return 'YES';
    }

    if (isSpecialYesNoProp(Number(betType))) {
        return position === Position.HOME ? 'YES' : 'NO';
    }

    if (betType === BetType.SPREAD) return 'H' + (position === Position.HOME ? '1' : '2');
    if (betType === BetType.TOTAL || isPlayerProps(betType)) return position === Position.HOME ? 'O' : 'U';
    if (betType === BetType.DOUBLE_CHANCE)
        switch (market.doubleChanceMarketType) {
            case DoubleChanceMarketType.HOME_TEAM_NOT_TO_LOSE:
                return '1X';
            case DoubleChanceMarketType.AWAY_TEAM_NOT_TO_LOSE:
                return 'X2';
            case DoubleChanceMarketType.NO_DRAW:
                return '12';
            default:
                return '';
        }
    if (position === Position.DRAW) return 'X';
    return position === Position.HOME ? '1' : '2';
};


export const isOneSidePlayerProps = (betType: BetType) => {
    return ONE_SIDER_PLAYER_PROPS_BET_TYPES.includes(betType);
};

export const isSpecialYesNoProp = (betType: BetType) => {
    return SPECIAL_YES_NO_BET_TYPES.includes(betType);
};



export const getIsOneSideMarket = (tag: number) =>
    SPORTS_TAGS_MAP['Motosport'].includes(Number(tag)) || Number(tag) == GOLF_TOURNAMENT_WINNER_TAG;

export const GOLF_TOURNAMENT_WINNER_TAG = 109121;


export const getParlayItemStatus = (market: SportMarketInfo) => {
    if (market.isCanceled) return 'Canceled';
    if (market.isResolved) {
        if (market.playerName !== null) {
            return market.playerPropsScore;
        }
        return `${market.homeScore} : ${market.awayScore}`;
    }
    return formatDateWithTime(Number(market.maturityDate) * 1000);
};

export const formatDateWithTime = (date: Date | number) => format(date, 'dd MMM HH:mm');

export const formatMarketOdds = (oddsType: OddsType, odds: number | undefined) => {
    if (!odds) {
        return '0';
    }
    switch (oddsType) {
        case OddsType.Decimal:
            return `${formatCurrency(1 / odds, 2)}`;
        case OddsType.American:
            const decimal = 1 / odds;
            if (decimal >= 2) {
                return `+${formatCurrency((decimal - 1) * 100, 0)}`;
            } else {
                return `-${formatCurrency(100 / (decimal - 1), 0)}`;
            }
        case OddsType.AMM:
        default:
            return `${formatCurrency(odds, odds < 0.1 ? 4 : 2)}`;
    }
};


export const formatCurrency = (value: NumericValue, decimals = DEFAULT_CURRENCY_DECIMALS, trimDecimals = false) => {
    if (!value || !Number(value)) {
        return 0;
    }

    return numbro(value).format({
        thousandSeparated: true,
        trimMantissa: trimDecimals,
        mantissa: decimals,
    });
};

