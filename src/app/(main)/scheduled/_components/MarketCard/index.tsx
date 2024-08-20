import './style.scss';
import useAppContext from '@/lib/hooks/useAppContext';
import Image from 'next/image';

import favoriteFull from './favorite-full.svg';
import favoriteOutline from './favorite-outline.svg';

import { useMemo, useState } from 'react';
import { isOnGoing, progressBar, teamLogoUrl, timeStr } from '@/lib/utils/general';
import { Field, Market, SupportedType } from '@/lib/types/overtime';
import { dateStr } from '@/bixie-shared/utils/general';
import InfoBox from '@/components/InfoBox';
import MoreButton from '@/components/MoreButton';
import InfoGroup from '../InfoGroup';


export default function MarketCard(market: Market) {
  const { data, setDataWith } = useAppContext();

  const [homeError, setHomeError] = useState(false);
  const [awayError, setAwayError] = useState(false);

  const types: SupportedType[] = useMemo(() => {
    const list: SupportedType[] = [];
    for (const m of market.childMarkets) {
      if (!list.includes(m.type)) {
        list.push(m.type);
      }
    }
    return list;
  }, [market.childMarkets]);

  const togglePosition = (market: Market, position: Field) => {
    setDataWith(d => {
      let { positions } = d;
      if (positions.some(pos => pos.market.address === market.address && pos.position === position)) {
        positions = positions.filter(pos => !(pos.market.address === market.address && pos.position === position));
      } else {
        positions = positions.filter(pos => pos.market.gameId !== market.gameId);
        positions = [...positions, {
          market,
          position,
          paid: 0,
        }];
      }
      return {
        ...d,
        positions,
      }
    });
  }

  const openMore = () => {
    setDataWith(d => ({
      ...d,
      openDetailed: moreOpen ? d.openDetailed.filter(address => (address !== market.address)) : [...d.openDetailed, market.address],
    }));
  }

  const toggleFavorite = () => {
    if (isFavorite) {
      setDataWith(d => ({ ...d, favorites: d.favorites.filter(m => m.address != market.address) }));
    } else {
      setDataWith(d => ({ ...d, favorites: [...d.favorites, market] }));
    }
  }

  const { favorites, openDetailed, odds, status } = data;
  const moreOpen = openDetailed.includes(market.address);
  const isFavorite = favorites.find(m => m.address === market.address);

  const { homeOdds, drawOdds, awayOdds } = market.odds;

  const progress = progressBar(
    market.maturityDate,
    market.sport === "Soccer" ? "football" : "basketball"
  );

  const ongoing = isOnGoing(market);

  return (
    <div className='market-card'>
      <button className="favorite-box" onClick={toggleFavorite}>
        {isFavorite && <Image src={favoriteFull} alt="" />}
        {!isFavorite && <Image src={favoriteOutline} alt="" />}
      </button>
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
      {market.isOpen && !market.isPaused && (
        <>
          <div className="odds-box">
            <InfoBox
              title="1"
              field={Field.Home}
              value={homeOdds[odds]?.toFixed(2)}
              market={market}
              onClick={() => togglePosition(market, Field.Home)}
            />
            {market.odds.drawOdds[odds] && (
              <InfoBox
                title="X"
                field={Field.X}
                value={+drawOdds[odds].toFixed(2)}
                market={market}
                onClick={() => togglePosition(market, Field.X)}
              />
            )}
            <InfoBox
              title="2"
              field={Field.Away}
              value={awayOdds[odds]?.toFixed(2)}
              market={market}
              onClick={() => togglePosition(market, Field.Away)}
            />
            <MoreButton open={moreOpen} onClick={openMore} />
          </div>
          {moreOpen &&
            types.map((type, index) => (
              <InfoGroup
                key={index}
                type={type}
                parentMarket={market}
                onPositionSelected={togglePosition}
              />
            ))}
        </>
      )}
    </div>
  )
}