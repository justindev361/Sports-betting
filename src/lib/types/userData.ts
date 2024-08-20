import { MarketData, Position } from "./market";

export interface IUserData {
    singles: ISingle[]
    parlays: IParlays[]
}

interface ISingle {
    account: string;
    amount: number;
    hash: string;
    market: MarketData;
    paid: number;
    position: number;
    status: "LOSS" | "WON"
    timestamp: Date
}

interface IParlays {
    account: string;
    hash: string;
    id: string;
    isClaimable: boolean;
    isClaimed: boolean;
    isOpen: boolean;
    lastGameStarts: Date;
    paid: number;
    paidAfterFees: number;
    payout: number;
    // position: Position
    status: "LOSS" | 'WON'
}