import './style.scss';
import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
}

export default function ClaimButton(props: Props) {
  const { loading, ...rest } = props;
  return (
    <button {...rest} className="claim-button" disabled={rest.disabled || !!loading}>
      {loading && <span>Claiming ...</span>}
      {!loading && <span>Claim</span>}

    </button>
  )
}