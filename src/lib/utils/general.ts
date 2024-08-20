import { leagueNames } from "../constants/ui";
import { TimeType, Market } from "../types/overtime";

export const marketFilter = (time: TimeType, markets: Market[]) => {
  if (time === "all") {
    return markets;
  } else if (time === "today") {
    const now = new Date();
    return markets.filter((m) => {
      const date = new Date(m.maturityDate);
      return (
        now.getFullYear() === date.getFullYear() &&
        now.getMonth() === date.getMonth() &&
        now.getDate() === date.getDate()
      );
    });
  } else if (time === "in-1h") {
    const now = Date.now();
    return markets.filter((m) => {
      const date = new Date(m.maturityDate).getTime();
      return 0 < date - now && date - now <= 60 * 60 * 1000;
    });
  }
  return [];
};

export const dateStr = (dateText: string) => {
  const date = new Date(dateText);
  return `${date.toLocaleString("en-US", { month: "short", day: "2-digit" })}`;
};

export const progressBar = (dateText: string, type: string) => {
  const date = new Date(dateText);
  const now = Date.now();

  const diff = (now - Number(date)) / 60000;

  const length = type === "football" ? (diff / 105) * 100 : (diff / 140) * 100;
  if (length > 100) return 100;
  return Number(length.toFixed(0));
};

export const timeStr = (dateText: string) => {
  const date = new Date(dateText);
  return date.toLocaleTimeString('en-US', { hour12: true, timeStyle: 'short' });
}

export const teamLogoUrl = (leagueId: number, leagueName: string, teamName: string) => {
  // console.log(leagueId, leagueName)
  const tname = teamName.toLocaleLowerCase().trim().replaceAll(' ', '-');
  if (leagueId === 18196 || tname.includes('/')) {
    return 'https://www.overtimemarkets.xyz/logos/overtime-logo.png';
  } else if (leagueId === 18821 || leagueId === 9050) {
    return `https://www.overtimemarkets.xyz/logos/Countries/${tname}.svg`;
  }

  return `https://www.overtimemarkets.xyz/logos/${leagueNames[leagueId] ?? leagueName}/${tname}.webp`;
}

export const toWei = (value: number, decimals: number = 18): bigint => {
  return BigInt(Math.floor(value * (10 ** decimals)));
}

export const fromWei = (value: bigint, decimals: number = 18): number => {
  return Number(value) / (10 ** decimals);
}

export const addClass = (selector: string, className: string) => {
  document.querySelectorAll(selector).forEach(element => element.classList.add(className));
}

export const removeClass = (selector: string, className: string) => {
  document.querySelectorAll(selector).forEach(element => element.classList.remove(className));
}

export const randomInt = (min: number, max: number) => {
  return min + Math.floor(Math.random() * (max - min));
}

/**
 * 
 * @returns before < after: -1
 * @returns before == after: 0
 * @returns before > after: 1
 */
export const compareTime = (before: string, after: string) => {
  const date1 = new Date(before);
  const date2 = new Date(after);

  return date1.getTime() < date2.getTime() ? -1 : date1.getTime() === date2.getTime() ? 0 : 1;
}

export const fixOneSideMarketCompetitorName = (team: string) => {
  return team.endsWith('YES') ? (team !== null ? team.slice(0, team.length - 4).trim() : '') : team;
};

export const isOnGoing = (market: Market) => {
  return market.isOpen && compareTime(market.maturityDate, Date()) === -1;
}