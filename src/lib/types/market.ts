export type ParlayMarketWithQuotes = ParlayMarket & { quotes: number[] };

export type ParlayMarket = {
    id: string;
    txHash: string;
    sportMarkets: SportMarketInfo[];
    sportMarketsFromContract: string[];
    positions: PositionData[];
    positionsFromContract: number[];
    marketQuotes: number[];
    account: string;
    totalAmount: number;
    sUSDPaid: number;
    sUSDAfterFees: number;
    totalQuote: number;
    skewImpact: number;
    timestamp: number;
    lastGameStarts: number;
    blockNumber: number;
    claimed: boolean;
    won: boolean;
};

export type PositionData = {
    id: string;
    market: SportMarketInfo;
    side: PositionNameType;
    claimable: boolean;
};


type PositionNameType = 'HOME' | 'AWAY' | 'DRAW';

type GameDetails = {
    gameId: string;
    gameLabel: string;
};

export enum GlobalFiltersEnum {
    OpenMarkets = 'OpenMarkets',
    PendingMarkets = 'PendingMarkets',
    ResolvedMarkets = 'ResolvedMarkets',
    Canceled = 'Canceled',
}


export enum Position {
    HOME = 0,
    AWAY = 1,
    DRAW = 2,
}


export enum DoubleChanceMarketType {
    HOME_TEAM_NOT_TO_LOSE = 'HomeTeamNotToLose',
    NO_DRAW = 'NoDraw',
    AWAY_TEAM_NOT_TO_LOSE = 'AwayTeamNotToLose',
}

export type MarketData = {
    address: string;
    gameDetails: GameDetails;
    positions: Record<Position, { odd: number | undefined }>;
    tags: number[];
    homeTeam: string;
    awayTeam: string;
    maturityDate: number;
    resolved: boolean;
    cancelled: boolean;
    finalResult: number;
    gameStarted: boolean;
    homeScore?: number;
    awayScore?: number;
    leagueRaceName?: string;
    paused: boolean;
    betType: number;
    isApex: boolean;
    parentMarket: string;
    childMarketsAddresses: string[];
    childMarkets: MarketData[];
    spread: number;
    total: number;
    doubleChanceMarketType: DoubleChanceMarketType | null;
    isOneSideMarket: boolean;
    playerId: number | null;
    playerName: string | null;
    playerPropsLine: number | null;
    playerPropsType: number | null;
    playerPropsOutcome: number | null;
    playerPropsScore: number | null;
};

export type SportMarketChildMarkets = {
    spreadMarkets: SportMarketInfo[];
    totalMarkets: SportMarketInfo[];
    doubleChanceMarkets: SportMarketInfo[];
    strikeOutsMarkets: SportMarketInfo[];
    homeRunsMarkets: SportMarketInfo[];
    rushingYardsMarkets: SportMarketInfo[];
    passingYardsMarkets: SportMarketInfo[];
    receivingYardsMarkets: SportMarketInfo[];
    passingTouchdownsMarkets: SportMarketInfo[];
    oneSiderTouchdownsMarkets: SportMarketInfo[];
    fieldGoalsMadeMarkets: SportMarketInfo[];
    pitcherHitsAllowedMarkets: SportMarketInfo[];
    oneSiderGoalsMarkets: SportMarketInfo[];
    shotsMarkets: SportMarketInfo[];
    pointsMarkets: SportMarketInfo[];
    hitsRecordedMarkets: SportMarketInfo[];
    reboundsMarkets: SportMarketInfo[];
    assistsMarkets: SportMarketInfo[];
    doubleDoubleMarkets: SportMarketInfo[];
    tripleDoubleMarkets: SportMarketInfo[];
    receptionsMarkets: SportMarketInfo[];
    firstTouchdownMarkets: SportMarketInfo[];
    lastTouchdownMarkets: SportMarketInfo[];
};


export type SportMarketInfo = {
    id: string;
    address: string;
    gameId: string;
    maturityDate: Date;
    tags: number[];
    isOpen: boolean;
    isResolved: boolean;
    isCanceled: boolean;
    finalResult: number;
    poolSize: number;
    numberOfParticipants: number;
    homeTeam: string;
    awayTeam: string;
    homeOdds: number;
    awayOdds: number;
    drawOdds: number | undefined;
    homeScore: number | string;
    awayScore: number | string;
    sport: string;
    isApex: boolean;
    resultDetails: string;
    isPaused: boolean;
    leagueRaceName?: string;
    qualifyingStartTime?: number;
    arePostQualifyingOddsFetched: boolean;
    betType: number;
    homeBonus: number;
    awayBonus: number;
    drawBonus?: number;
    parentMarket: string;
    childMarkets: SportMarketInfo[];
    spread: number;
    total: number;
    doubleChanceMarketType: DoubleChanceMarketType | null;
    combinedMarketsData?: CombinedMarket[];
    isOneSideMarket: boolean;
    playerId: number | null;
    playerName: string | null;
    playerPropsLine: number | null;
    playerPropsType: number | null;
    playerPropsOutcome: number | null;
    playerPropsScore: number | null;
};

export type CombinedMarket = {
    markets: SportMarketInfo[];
    positions: Position[];
    totalOdd: number;
    totalBonus: number;
    positionName: CombinedMarketsPositionName | null;
};


export type CombinedMarketsPositionName =
    | '1&O'
    | '1&U'
    | 'H1&O'
    | 'H1&U'
    | 'X&O'
    | 'X&U'
    | '2&O'
    | '2&U'
    | 'H2&O'
    | 'H2&U'
    | '';

export type SportsTagsMap = Record<string, number[]>;