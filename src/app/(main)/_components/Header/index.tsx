'use client'

import './style.scss';
import ConnectButton from '@/wallet-connect/ConnectButton';
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import Image from 'next/image';
import useAppContext from '@/lib/hooks/useAppContext';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import logo from "./logo.png"


export default function Header() {
  const { setData } = useAppContext();
  const router = useRouter();
  const account = useAccount();

  return <div className="main-header">
    <div className="header-top-outter">
      <div className="header-top">
        <button className='logo-button' onClick={() => setData({ sideBarVisible: true })}>
          <DensityMediumIcon fontSize="large" />
          <div className="logo-box">
            <Image src={logo} alt='' fill objectFit='contain' priority />
          </div>
        </button>
        <div className="header-right-part">
          <ConnectButton />
          {/* {account.isConnected && (
            <button className="leader-button" onClick={() => router.push('/leaderboard')}>
              <div className="leader-image-box">
                <Image src='./assets/images/leaderboard-icon.svg' alt='' fill quality={100} priority />
              </div>
              Leaderboard
            </button>
          )} */}
        </div>
      </div>
    </div>
  </div>
}