import { Badge } from '@mui/material';

interface Props {
  title: string
  selected: boolean
  badgeText?: string
  onClick: () => void
}

export default function TabButton({ title, selected, badgeText, onClick }: Props) {
  return (
    <>
      {badgeText &&
        <div className="tab-button" onClick={onClick} style={selected ? { borderBottom: '3px solid white', fontWeight: 'bold', color: 'white' } : undefined}>
          <Badge badgeContent={badgeText} color='error' invisible={!badgeText} sx={{'.MuiBadge-badge': { top: '3px' }}}>
            {title}
          </Badge>
        </div>
      }
      {!badgeText &&
        <div className="tab-button" onClick={onClick} style={selected ? { borderBottom: '3px solid white', fontWeight: 'bold', color: 'white' } : undefined}>
          {title}
        </div>
      }
    </>
  )
}