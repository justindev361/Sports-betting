import './style.scss';
import { dateStr, isOnGoing, teamLogoUrl, timeStr } from '@/lib/utils/general';
import { PositionDto, SupportedType } from '@/lib/types/overtime';
import { useState } from 'react';
import Image from 'next/image';
import useAppContext from '@/lib/hooks/useAppContext';
import RemoveButton from './RemoveButton';
import { marketTypeTitles } from '@/app/(main)/scheduled/_components/InfoGroup';

const oddsText: { [key: string]: string[] } = {
  moneyline: ['1', '2', 'X'],
  doubleChance: ['1X', 'X2', '12'],
  spread: ['1', '2', 'X'],
  fieldGoalsMade: ['H1', 'H2', ''],
  total: ['O', 'U', ''],
  receivingYards: ['1', '2'],
  passingYards: ['1', '2'],
  rushingYards: ['1', '2'],
  points: ['1', '2'],
  rebounds: ['1', '2'],
  assists: ['1', '2'],
  goals: ['1', '2'],
  shots: ['1', '2'],
}

export default function BetCard(position: PositionDto) {
  const { data: { odds }, setDataWith } = useAppContext();

  const [homeError, setHomeError] = useState(false);
  const [awayError, setAwayError] = useState(false);

  const { market } = position;
  const { homeOdds, drawOdds, awayOdds } = position.market.odds;
  const ongoing = isOnGoing(market);

  const removePosition = () => {
    setDataWith(d => {
      let { positions } = d;
      positions = positions.filter(p => p.market.address !== position.market.address);
      return { ...d, positions };
    });
  }


  return (
    <div className='bet-card'>
      <div className='remove-button-outter'>
        <RemoveButton onClick={removePosition} />
      </div>
      <div className="team-info">
        <div className="top-box">
          <span className="date-box">{timeStr(market.maturityDate)}</span>
          {!ongoing && <span className="text-lg">{`${market.homeScore} : ${market.awayScore}`}</span>}
          {ongoing && market.score !== '' && <span className="text-lg">{market.score}</span>}
          {ongoing && <div className="bg-[#E33D38] px-3 font-semibold">LIVE</div>}
          <span className="date-box">{dateStr(market.maturityDate)}</span>
        </div>
        {/* Home Team */}
        <div className="team-box home-team">
          {homeError && (
            <Image
              src={'https://www.overtimemarkets.xyz/logos/overtime-logo.png'}
              alt="Away"
              className="team-img"
              width={100}
              height={100}
            />
          )}
          {!homeError && (
            <Image
              src={teamLogoUrl(
                market.leagueId,
                market.leagueName,
                market.homeTeam
              )}
              alt="Home"
              className="team-img"
              width={100}
              height={100}
              onError={() => setHomeError(true)}
            />
          )}
          <div className="team-name">{market.homeTeam}</div>
        </div>
        {/* Away Team */}
        <div className="team-box away-team">
          {awayError && (
            <Image
              src={'https://www.overtimemarkets.xyz/logos/overtime-logo.png'}
              alt="Away"
              className="team-img"
              width={100}
              height={100}
            />
          )}
          {!awayError && (
            <Image
              src={teamLogoUrl(
                market.leagueId,
                market.leagueName,
                market.awayTeam
              )}
              alt="Away"
              className="team-img"
              width={100}
              height={100}
              onError={() => setAwayError(true)}
            />
          )}
          <div className="team-name">{market.awayTeam}</div>
        </div>
      </div>
      <div className="h-line"></div>
      <div className="bet-info">
        <div className='text-sm mr-auto'>{marketTypeTitles[market.type]}</div>
        <div className='odds-title-box'>
          <span>{oddsText[market.type][position.position]}</span>
        </div>
        <div className='bet-info-box'>
          <span>Odds</span>
          <span>
            {position.position === 0 && homeOdds ? homeOdds[odds].toFixed(2)
              : position.position === 1 && awayOdds ? awayOdds[odds].toFixed(2)
                : position.position === 2 && drawOdds ? drawOdds[odds].toFixed(2)
                  : -1
            }
          </span>
        </div>
      </div>
    </div>
  )
}