import './style.scss';
import { useState } from 'react';
import { Position } from '@/lib/types/overtime';
import { dateStr, isOnGoing, teamLogoUrl } from '@/lib/utils/general';
import { claimSingle } from '@/lib/api/betting';
import useAppContext from '@/lib/hooks/useAppContext';
import Image from 'next/image';
import { toast } from 'react-toastify';
import ClaimButton from '../ClaimButton';
import { archivoBlack } from '@/lib/utils/fonts';

export default function OpenSingleCard(position: Position) {
  const { data: { odds } } = useAppContext();
  const [loading, setLoading] = useState(false);

  const [homeError, setHomeError] = useState(false);
  const [awayError, setAwayError] = useState(false);

  const onClick = async () => {
    if (position.isClaimable) {
      setLoading(true);
      try {
        await claimSingle(position.market.address);
        location.reload();
      } catch (_) {
        toast('Couldn\'t claim!');
      }
      setLoading(false);
    }
  }

  const { homeOdds, drawOdds, awayOdds } = position.market.odds;
  const { market } = position;

  const ongoing = isOnGoing(market);

  return (
    <div className="closed-single-card">
      {/* <div className="result-box" data-status={position.status}>{position.status === 'WON' ? 'WON' : 'LOSS'}</div> */}
      <div className="team-info">
        <div className="top-box flex flex-col gap-2 mb-3">
          <span className="date-box">{dateStr(market.maturityDate)}</span>
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
        <div className='relative w-12 h-12'>
          {position.position === 0 && (
            <>
              {homeError && (
                <Image
                  src={'https://www.overtimemarkets.xyz/logos/overtime-logo.png'} alt="Away" fill objectFit='cover'
                />
              )}
              {!homeError && (
                <Image
                  src={teamLogoUrl(
                    market.leagueId,
                    market.leagueName,
                    market.homeTeam
                  )}
                  alt="Home" fill objectFit='cover'
                  onError={() => setHomeError(true)}
                />
              )}
            </>
          )}
          {position.position === 1 && (
            <>
              {awayError && (
                <Image
                  src={'https://www.overtimemarkets.xyz/logos/overtime-logo.png'} alt="Away" fill objectFit='cover'
                />
              )}
              {!awayError && (
                <Image
                  src={teamLogoUrl(
                    market.leagueId,
                    market.leagueName,
                    market.awayTeam
                  )}
                  alt="Away" fill objectFit='cover'
                  onError={() => setAwayError(true)}
                />
              )}
            </>
          )}
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
        <div className='bet-info-box'>
          <span>Stake</span>
          <span>{`$${position.paid.toFixed(2)}`}</span>
        </div>
        <div className="claim-box">
          <span className={`${archivoBlack.className} payout-box`} data-status={position.status}>{`+ $${position.payout.toFixed(2)}`}</span>
          {position.isClaimable && <ClaimButton onClick={onClick} loading={loading} />}
        </div>
      </div>
    </div>
  )
}