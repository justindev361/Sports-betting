'use client'

import './style.scss';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface Props {
  open: boolean
  onClick?: VoidFunction
}

export default function MoreButton({ open, onClick }: Props) {
  return (
    <div className="more-button" onClick={onClick}>
      {open && <KeyboardArrowUpIcon />}
      {!open && <KeyboardArrowDownIcon />}
    </div>
  )
}