import './style.scss';

import { OverridableComponent } from "@mui/material/OverridableComponent";
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import SportsHockeyIcon from '@mui/icons-material/SportsHockey';
import SportsMmaIcon from '@mui/icons-material/SportsMma';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import SportsMotorsportsIcon from '@mui/icons-material/SportsMotorsports';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SportsGolfIcon from '@mui/icons-material/SportsGolf';


const icons: { [key: string]: OverridableComponent<any> } = {
  'football': SportsFootballIcon,
  'soccer': SportsSoccerIcon,
  'basketball': SportsBasketballIcon,
  'baseball': SportsBaseballIcon,
  'hockey': SportsHockeyIcon,
  'mma': SportsMmaIcon,
  'cricket': SportsCricketIcon,
  'tennis': SportsTennisIcon,
  'motosport': SportsMotorsportsIcon,
  'esports': SportsEsportsIcon,
  'golf': SportsGolfIcon,
}

interface Props {
  title: string
  count: number
  selected: boolean
  onClick: VoidFunction
}

export default function SportListButton({ title, count, selected, onClick }: Props) {
  const Icon = icons[title.toLowerCase()];

  return (
    <button className={`sport-list-button ${selected ? 'selected' : ''}`} onClick={onClick} data-sport={title}>
      <Icon />
      <span>{title}</span>
      <span>{count}</span>
    </button>
  )
}