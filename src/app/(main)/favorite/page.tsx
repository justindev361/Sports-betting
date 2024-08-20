'use client'

import './style.scss';
import useAppContext from "@/lib/hooks/useAppContext"
import NoBets from "@/components/NoBets";
import MarketCard from '../scheduled/_components/MarketCard';

export default function Page() {
  const { data: { favorites } } = useAppContext();

  return (
    <div className="container mx-auto flex justify-center">
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mt-12 justify-center w-fit mx-auto'>
        {favorites.length === 0 && <NoBets />}
        {favorites.map(market => (
          <div key={market.address} className=''>
            <MarketCard {...market} />
          </div>
        ))}
      </div>
    </div>
  )
}