import axios from "axios";
import {
  Field,
  League,
  Market,
  Network,
  Position,
  PositionStatus,
  PositionType,
  Quote,
} from "../types/overtime";
import { IUserData } from "../types/userData";
import { TokenData, Tokens, tokens } from "../constants/token";

const baseUrl = "https://api.thalesmarket.io/overtime/network";
const mainUrl = "https://api.thalesmarket.io";
const allSportsUrl = "https://apiv3.allsportsapi.com";
const apiKey =
  "c0762e512f7f821191605c843f9f36157b19b77d557a113f9f43b4cea315f374";

const check = (data: any) => {
  if (typeof data !== "object") {
    throw new Error("Wrong result due to wrong network! (Bixie)");
  }
};

export const getLeagues = async (network: Network) => {
  const { data: leagues } = await axios.get<League[]>(
    `${baseUrl}/${network}/sports`
  );
  check(leagues);

  const sports: string[] = [];
  for (const league of leagues) {
    if (!sports.includes(league.sport)) {
      sports.push(league.sport);
    }
  }
  return {
    sports,
    leagues,
  };
};

export const getLeaderboard = async (network: Network) => {
  const { data } = await axios.get(
    `${mainUrl}/parlay-leaderboard/${network}/5`
  );
  check(data);
  return data;
};

export const getUserOvertimeTransations = async (
  network: Network,
  address: `0x${string}` | undefined
): Promise<IUserData> => {
  const { data } = await axios.get(
    `${baseUrl}/${network}/users/${address}/transactions`
  );
  check(data);
  return data;
};

const getMainToken = (token: any): TokenData => {
  let tokenData = {} as TokenData;
  Object.keys(token).forEach((key) => {
    if (token[key].main) {
      tokenData = token[key];
    }
  });

  return tokenData;
};

export const getTokenPrice = async (network: Network) => {
  const geckoUrl = "https://api.geckoterminal.com/api/v2";
  const address = getMainToken(tokens[network]).address;
  const { data } = await axios.get(
    `${geckoUrl}/simple/networks/${Network[
      network
    ].toLowerCase()}/token_price/${address}`
  );
  check(data);
  data.address = address;
  return data;
};

export const getMarkets = async (
  network: Network,
  option: Partial<{
    sport: string;
    leagueId: number;
    ungroup: boolean;
    _status: string;
  }>
) => {
  const { data } = await axios.get<Market[]>(`${baseUrl}/${network}/markets`, {
    params: {
      sport: option.sport,
      leagueId: option.leagueId,
      ungroup: option.ungroup,
      status: option._status,
    },
  });
  check(data);

  const _sport =
    option.sport === "Soccer"
      ? "football"
      : option.sport === "Basketball"
      ? "basketball"
      : "nothing";

  if (data.length === 0 || option._status !== "ongoing" || _sport === "nothing")
    return data;

  // Get Live Data
  const res = await axios.get(
    `${allSportsUrl}/${_sport}/?met=Livescore&APIkey=${apiKey}`
  );
  const liveScore = res.data.result;

  if (!liveScore || liveScore.length === 0) return data;

  let cnt = 0;
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < liveScore.length; j++) {
      const homeTeam = data[i].homeTeam.replace("-", " ");
      const awayTeam = data[i].awayTeam.replace("-", " ");
      if (
        homeTeam === liveScore[j].event_home_team &&
        awayTeam === liveScore[j].event_away_team
      ) {
        data[i].score = liveScore[j].event_final_result;
        cnt++;
      }
    }
  }

  // console.log('cnt', cnt);

  if (cnt === 0) return [];

  return data;
};

export const getMarket = async (network: Network, marketAddress: string) => {
  const { data } = await axios.get<Market>(
    `${baseUrl}/${network}/markets/${marketAddress}`
  );
  check(data);
  return data;
};

export const getPositions = async (
  networkId: Network,
  userAddress: string,
  option: { type?: PositionType; status?: PositionStatus }
) => {
  const { data } = await axios.get<{
    [key in PositionType]: { [key in PositionStatus]: Position[] };
  }>(
    `${baseUrl}/${networkId}/users/${userAddress}/positions/?type=${
      option.type ?? ""
    }&status=${option.status ?? ""}`
  );
  check(data);

  return {
    singles: data.singles[option.status ?? "open"],
    parlays: data.parlays[option.status ?? "open"],
  };
};

export const getCollaterals = async (network: Network) => {
  const { data } = await axios.get(`${baseUrl}/${network}/collaterals`);
  check(data);
  return data;
};

/**
 *
 * @param buyIn must be in USD
 * @returns
 */
export const getSingleQuote = async (
  network: Network,
  marketAddress: string,
  position: Field,
  buyIn: number
) => {
  const { data } = await axios.get<Quote>(
    `${baseUrl}/${network}/markets/${marketAddress}/quote?position=${position}&buyIn=${buyIn}`
  );
  check(data);
  return data;
};

/**
 *
 * @param buyIn must be in USD
 * @returns
 */
export const getParlayQuote = async (
  network: Network,
  marketAddresses: string[],
  positions: Field[],
  buyIn: number
) => {
  const { data } = await axios.get<Quote>(
    `${baseUrl}/${network}/parlay/quote?markets=${marketAddresses.join(
      ","
    )}&positions=${positions.join(",")}&buyIn=${buyIn}`
  );
  check(data);
  return data;
};
