import { BetType } from "../enums/markets";
import { SportsTagsMap } from "../types/market";

export const SPORTS_TAGS_MAP: SportsTagsMap = {
    Football: [9001, 9002],
    Baseball: [9003],
    Basketball: [9004, 9005, 9008, 9399, 9409],
    Hockey: [9006, 9033],
    Soccer: [
        9010,
        9011,
        9012,
        9013,
        9014,
        9015,
        9016,
        9017,
        9018,
        9019,
        9057,
        9061,
        9045,
        9296,
        9050,
        18806,
        18821,
        9288,
        9042,
        19216,
        9076,
        9073,
        9536,
        9268,
        19199,
    ],
    MMA: [9007, 18196],
    Motosport: [9445, 9497],
    Tennis: [9153, 9156],
    eSports: [18977, 18983, 19138],
    Cricket: [9020, 9021],
    Golf: [109021, 109121],
};


export const BetTypeNameMap: Record<BetType, string> = {
    [BetType.WINNER]: 'winner',
    [BetType.SPREAD]: 'spread',
    [BetType.TOTAL]: 'total',
    [BetType.DOUBLE_CHANCE]: 'double-chance',
    [BetType.PLAYER_PROPS_STRIKEOUTS]: 'strikeouts',
    [BetType.PLAYER_PROPS_HOMERUNS]: 'home runs',
    [BetType.PLAYER_PROPS_PASSING_YARDS]: 'passing yards',
    [BetType.PLAYER_PROPS_PASSING_TOUCHDOWNS]: 'passing touchdowns',
    [BetType.PLAYER_PROPS_RUSHING_YARDS]: 'rushing yards',
    [BetType.PLAYER_PROPS_RECEIVING_YARDS]: 'receiving yards',
    [BetType.PLAYER_PROPS_TOUCHDOWNS]: 'scoring touchdown',
    [BetType.PLAYER_PROPS_FIELD_GOALS_MADE]: 'field goals made',
    [BetType.PLAYER_PROPS_PITCHER_HITS_ALLOWED]: 'pitcher hits allowed',
    [BetType.PLAYER_PROPS_POINTS]: 'points',
    [BetType.PLAYER_PROPS_SHOTS]: 'shots',
    [BetType.PLAYER_PROPS_GOALS]: 'goals',
    [BetType.PLAYER_PROPS_HITS_RECORDED]: 'hits recorded',
    [BetType.PLAYER_PROPS_REBOUNDS]: 'rebounds',
    [BetType.PLAYER_PROPS_ASSISTS]: 'assists',
    [BetType.PLAYER_PROPS_DOUBLE_DOUBLE]: 'double double',
    [BetType.PLAYER_PROPS_TRIPLE_DOUBLE]: 'triple double',
    [BetType.PLAYER_PROPS_RECEPTIONS]: 'receptions',
    [BetType.PLAYER_PROPS_FIRST_TOUCHDOWN]: 'first touchdown',
    [BetType.PLAYER_PROPS_LAST_TOUCHDOWN]: 'last touchdown',
};