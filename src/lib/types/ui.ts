export enum Theme {
  dark = 'dark',
  light = 'light',
}

export const defaultTheme = Theme.dark;

export type PageName = 'scheduled' | 'mybets' | 'betslip' | 'favorite' | 'connectWallet' | 'leaderboard';

export interface PageData {
  name: PageName
  title: string
  path: string
}

export interface BasicPageProps {
  searchParams: Partial<{
    network: string
    sport: string
    time: string
    odds: string
    filter: string
    leagueId: string
    tab: string
  }>
  params: {}
}

export type BasicSearchParams = BasicPageProps['searchParams'];

export type WalletType = 'metamask' | 'trustwallet' | 'coinbase' | 'rainbow';

export interface Wallet {
  name: string
  type: WalletType
  imageUrl: string
}