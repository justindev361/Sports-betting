import './style.scss';
import Image from 'next/image';

import removeIcon from './remove-icon.svg';

interface Props {
  onClick: () => void
}

export default function RemoveButton({ onClick }: Props) {
  return (
    <div className="betcard-remove-button" onClick={onClick}>
      <Image src={removeIcon} alt='' fill objectFit='cover' />
    </div>
  )
}