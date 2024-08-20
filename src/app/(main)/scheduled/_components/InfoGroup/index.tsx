import './style.scss';
import InfoBox from "@/components/InfoBox";
import useAppContext from "@/lib/hooks/useAppContext";
import { Field, Market, SupportedType } from "@/lib/types/overtime";

export const marketTypeTitles: Record<SupportedType, string> = {
  'moneyline': 'Money Line',
  'spread': 'Handicap',
  'total': 'Total',
  'doubleChance': 'Double Chance',

  'doubleDouble': 'Double Double',
  'tripleDouble': 'Triple Double',
  'assists': 'Assists',
  'fieldGoalsMade': 'Field Goals Made',
  'goals': 'Goals',
  'hitsRecorded': 'Hits Records',
  'homeruns': 'Home Runs',
  'passingTouchdonws': 'Passing Touchdowns',
  'passingYards': 'Passing Yards',
  'pitcherHitsAllowed': 'PitcherHitsAllowed',
  'points': 'Points',
  'rebounds': 'Rebounds',
  'receivingYards': 'Receiving Yards',
  'rushingYards': 'Rushing Yards',
  'scoringTouchdowns': 'Scoring Touchdowns',
  'shots': 'Shots',
  'strikeouts': 'Strikeouts',
};

interface Props {
  type: SupportedType
  parentMarket: Market
  onPositionSelected: (market: Market, position: Field) => void
}

export default function InfoGroup({ type, parentMarket: pmarket, onPositionSelected: PositionSelected }: Props) {
  const { data: {odds} } = useAppContext();

  return (
    <div className="info-group">
      <span className="title">{marketTypeTitles[type]}</span>
      <div className="content">
        {type === 'doubleChance' && (() => {
          const homeNotLose = pmarket.childMarkets.find(m => m.type === 'doubleChance' && m.doubleChanceMarketType === 'HomeTeamNotToLose')!;
          const noDraw = pmarket.childMarkets.find(m => m.type === 'doubleChance' && m.doubleChanceMarketType === 'NoDraw')!;
          const awayNotLose = pmarket.childMarkets.find(m => m.type === 'doubleChance' && m.doubleChanceMarketType === 'AwayTeamNotToLose')!;
          return <div className="row">
            <InfoBox market={homeNotLose} title='1X' field={Field.Home} value={homeNotLose.odds.homeOdds[odds].toFixed(2)} onClick={() => PositionSelected(homeNotLose, Field.Home)} />
            <InfoBox market={noDraw} title='12' field={Field.Home} value={noDraw.odds.homeOdds[odds].toFixed(2)} onClick={() => PositionSelected(noDraw, Field.Home)} />
            <InfoBox market={awayNotLose} title='X2' field={Field.Home} value={awayNotLose.odds.homeOdds[odds].toFixed(2)} onClick={() => PositionSelected(awayNotLose, Field.Home)} />
          </div>
        })()}
        {type === 'spread' && pmarket.childMarkets.filter(m => m.type === type).map(market => {
          const { homeOdds, awayOdds } = market.odds;
          return (
            <div key={market.address} className="row">
              <InfoBox market={market} title='Home' field={Field.Home} value={homeOdds[odds].toFixed(2)} onClick={() => PositionSelected(market, Field.Home)} />
              <div className="info">{market.spread}</div>
              <InfoBox market={market} title='Away' field={Field.Away} value={awayOdds[odds].toFixed(2)} onClick={() => PositionSelected(market, Field.Away)} />
            </div>
          );
        })}
        {type === 'fieldGoalsMade' && pmarket.childMarkets.filter(m => m.type === type).map(market => {
          const { homeOdds, awayOdds } = market.odds;
          return (
            <div key={market.address} className="row">
              <InfoBox market={market} title='H1' field={Field.Home} value={homeOdds[odds].toFixed(2)} onClick={() => PositionSelected(market, Field.Home)} />
              <div className="player-info">{market.playerProps.playerName}</div>
              <InfoBox market={market} title='H2' field={Field.Away} value={awayOdds[odds].toFixed(2)} onClick={() => PositionSelected(market, Field.Away)} />
            </div>
          );
        })}
        {type === 'total' && pmarket.childMarkets.filter(m => m.type === type).map(market => {
          const { homeOdds, awayOdds } = market.odds;
          return (
            <div key={market.address} className="row">
              <InfoBox market={market} title='Over' field={Field.Over} value={homeOdds[odds].toFixed(2)} onClick={() => PositionSelected(market, Field.Over)} />
              <div className="info">{market.spread}</div>
              <InfoBox market={market} title='Under' field={Field.Under} value={awayOdds[odds].toFixed(2)} onClick={() => PositionSelected(market, Field.Under)} />
            </div>
          )
        })}
        {type === 'receivingYards' && pmarket.childMarkets.filter(m => m.type === type).map(market => {
          const { homeOdds, awayOdds } = market.odds;
          return (
            <div key={market.address} className="row">
              <InfoBox market={market} title='Home' field={Field.Home} value={homeOdds[odds].toFixed(2)} onClick={() => PositionSelected(market, Field.Home)} />
              <div className="player-info">{market.playerProps.playerName}</div>
              <InfoBox market={market} title='Away' field={Field.Away} value={awayOdds[odds].toFixed(2)} onClick={() => PositionSelected(market, Field.Away)} />
            </div>
          )
        })}
        {type === 'passingYards' && pmarket.childMarkets.filter(m => m.type === type).map(market => {
          const { homeOdds, awayOdds } = market.odds;
          return (
            <div key={market.address} className="row">
              <InfoBox market={market} title='Home' field={Field.Home} value={homeOdds[odds].toFixed(2)} onClick={() => PositionSelected(market, Field.Home)} />
              <div className="player-info">{market.playerProps.playerName}</div>
              <InfoBox market={market} title='Away' field={Field.Away} value={awayOdds[odds].toFixed(2)} onClick={() => PositionSelected(market, Field.Away)} />
            </div>
          )
        })}
        {type === 'rushingYards' && pmarket.childMarkets.filter(m => m.type === type).map(market => {
          const { homeOdds, awayOdds } = market.odds;
          return (
            <div key={market.address} className="row">
              <InfoBox market={market} title='Home' field={Field.Home} value={homeOdds[odds].toFixed(2)} onClick={() => PositionSelected(market, Field.Home)} />
              <div className="player-info">{market.playerProps.playerName}</div>
              <InfoBox market={market} title='Away' field={Field.Away} value={awayOdds[odds].toFixed(2)} onClick={() => PositionSelected(market, Field.Away)} />
            </div>
          )
        })}
        {/* {type === 'scoringTouchdowns' && pmarket.childMarkets.filter(m => m.type === type).map(market => {
          const { homeOdds, awayOdds } = market.odds;
          return (
            <div key={market.address} className="row">
              <InfoBox market={market} title='Home' field={Field.Home} value={homeOdds[odds].toFixed(2)} onClick={() => PositionSelected(market, Field.Home)} />
              <div className="player-info">{market.playerProps.playerName}</div>
              <InfoBox market={market} title='Away' field={Field.Away} value={awayOdds[odds].toFixed(2)} onClick={() => PositionSelected(market, Field.Away)} />
            </div>
          )
        })} */}
        {type === 'points' && pmarket.childMarkets.filter(m => m.type === type).map(market => {
          const { homeOdds, awayOdds } = market.odds;
          return (
            <div key={market.address} className="row">
              <InfoBox market={market} title='Home' field={Field.Home} value={homeOdds[odds].toFixed(2)} onClick={() => PositionSelected(market, Field.Home)} />
              <div className="player-info">{market.playerProps.playerName}</div>
              <InfoBox market={market} title='Away' field={Field.Away} value={awayOdds[odds].toFixed(2)} onClick={() => PositionSelected(market, Field.Away)} />
            </div>
          )
        })}
        {type === 'rebounds' && pmarket.childMarkets.filter(m => m.type === type).map(market => {
          const { homeOdds, awayOdds } = market.odds;
          return (
            <div key={market.address} className="row">
              <InfoBox market={market} title='Home' field={Field.Home} value={homeOdds[odds].toFixed(2)} onClick={() => PositionSelected(market, Field.Home)} />
              <div className="player-info">{market.playerProps.playerName}</div>
              <InfoBox market={market} title='Away' field={Field.Away} value={awayOdds[odds].toFixed(2)} onClick={() => PositionSelected(market, Field.Away)} />
            </div>
          )
        })}
        {type === 'assists' && pmarket.childMarkets.filter(m => m.type === type).map(market => {
          const { homeOdds, awayOdds } = market.odds;
          return (
            <div key={market.address} className="row">
              <InfoBox market={market} title='Home' field={Field.Home} value={homeOdds[odds].toFixed(2)} onClick={() => PositionSelected(market, Field.Home)} />
              <div className="player-info">{market.playerProps.playerName}</div>
              <InfoBox market={market} title='Away' field={Field.Away} value={awayOdds[odds].toFixed(2)} onClick={() => PositionSelected(market, Field.Away)} />
            </div>
          )
        })}
        {type === 'goals' && pmarket.childMarkets.filter(m => m.type === type).map(market => {
          const { homeOdds, awayOdds } = market.odds;
          return (
            <div key={market.address} className="row">
              <InfoBox market={market} title='Home' field={Field.Home} value={homeOdds[odds].toFixed(2)} onClick={() => PositionSelected(market, Field.Home)} />
              <div className="player-info">{market.playerProps.playerName}</div>
              <InfoBox market={market} title='Away' field={Field.Away} value={awayOdds[odds].toFixed(2)} onClick={() => PositionSelected(market, Field.Away)} />
            </div>
          )
        })}
        {type === 'shots' && pmarket.childMarkets.filter(m => m.type === type).map(market => {
          const { homeOdds, awayOdds } = market.odds;
          return (
            <div key={market.address} className="row">
              <InfoBox market={market} title='Home' field={Field.Home} value={homeOdds[odds].toFixed(2)} onClick={() => PositionSelected(market, Field.Home)} />
              <div className="player-info">{market.playerProps.playerName}</div>
              <InfoBox market={market} title='Away' field={Field.Away} value={awayOdds[odds].toFixed(2)} onClick={() => PositionSelected(market, Field.Away)} />
            </div>
          )
        })}
      </div>
    </div>
  )
}