export enum Field {
  Left = 0,
  Right = 1,
  Middle = 2,
  Home = Left,
  Away = Right,
  Draw = Middle,
  X = Draw,
  Over = Left,
  Under = Right,
}

export enum Network {
  Optimism = 10,
  Arbitrum = 42161,
  Base = 8453,
  // OptimismGoerli = 420,
}

export type SupportedType = (
  'moneyline' | 'spread' | 'total' | 'doubleChance' | 'passingYards' | 'rushingYards' | 'passingTouchdonws'
  | 'receivingYards' | 'scoringTouchdowns' | 'fieldGoalsMade' | 'points' | 'shots' | 'goals' | 'homeruns'
  | 'strikeouts' | 'pitcherHitsAllowed' | 'hitsRecorded' | 'points' | 'rebounds' | 'assists'
  | 'doubleDouble' | 'tripleDouble'
);

export type DoubleChanceType = 'HomeTeamNotToLose' | 'AwayTeamNotToLose' | 'NoDraw';

export type BetType = 'single' | 'parlay';
export type BetStatus = 'WON' | 'LOSS';

export type PositionType = 'singles' | 'parlays';
export type PositionStatus = 'open' | 'claimable' | 'closed';

export type TimeType = 'all' | 'today' | 'in-1h';
export type OddsType = 'american' | 'decimal' | 'normalizedImplied';
export type StatusType = 'open' | 'resolved' | 'canceled' | 'paused' | 'ongoing';

export type Odds = { [key in OddsType]: number };



export interface League {
  id: number
  name: string
  sport: string
  supportedTypes: SupportedType[]
}

export interface PlayerProps {
  line: number
  outcome: number | null
  playerId: number
  playerName: number
  score: number
  type: SupportedType
}

export interface Market {
  address: `0x${string}`
  gameId: string
  sport: string
  type: SupportedType
  leagueId: number
  leagueName: string
  homeTeam: string
  awayTeam: string
  maturityDate: string
  spread: number
  total: number
  doubleChanceMarketType: DoubleChanceType
  playerProps: PlayerProps
  isOpen: boolean
  isPaused: boolean
  homeScore: number
  awayScore: number
  odds: {
    homeOdds: Odds
    awayOdds: Odds
    drawOdds: Odds
  }
  priceImpact: {
    homePriceImpact: number
    awayPriceImpact: number
    drawPriceImpact: number
  }
  bonus: {
    homeBonus: number
    awayBonus: number
    drawBonus: number
  }
  childMarkets: Market[]
  score: string
}

export interface Position {
  account: string
  position: Field
  positions: Position[]
  payout: number
  paid: number
  status: BetStatus
  market: Market
  isClaimable: boolean
}

export interface PositionDto {
  market: Market
  position: Field
  paid: number
}


export type OptimismTokenType = 'sUSD' | 'USDT' | 'ETH' | 'DAI' | 'USDC' | 'OP' | 'WETH' | 'ETH';
export type ArbitrumTokenType = 'USDCe' | 'USDC' | 'USDT' | 'DAI' | 'USDT' | 'ARB' | 'WETH' | 'ETH';
export type BaseTokenType = 'USDbc' | 'WETH' | 'ETH' ;

export type TokenType = OptimismTokenType | ArbitrumTokenType | BaseTokenType;


export interface Quote {
  quote: {[key in OddsType]: number}
  payout: number
  potenitialProfit: {
    usd: number
    percentage: number
  }
  actualBuyInCollateralAmount: number
  actualBuyInUsdAmount: number
  skew: number
}