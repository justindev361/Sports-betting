import './style.scss';

import { HTMLAttributes } from "react";
import CloseIcon from '@mui/icons-material/Close';

export default function CloseButton(props: HTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;
  return (
    <button {...rest} className={`close-button ${className ?? ''}`}>
      <CloseIcon fontSize='large' />
    </button>
  )
}