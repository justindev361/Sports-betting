import './style.scss';

import { tokens } from "@/lib/constants/token";
import useAppContext from "@/lib/hooks/useAppContext";
import { OptimismTokenType } from "@/lib/types/overtime";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react"

interface Props {
  tokenType: OptimismTokenType
  onChange: (type: OptimismTokenType) => void
}

export default function TokenSelect({ tokenType, onChange }: Props) {
  const [contentVisible, setContentVisible] = useState(false);
  const { data: { network} } = useAppContext();
  const titleRef = useRef<any>();
  const contentRef = useRef<any>();

  const params = useSearchParams();
  const networkParam = params.get('network');
  
  const ToggleVisible = () => {
    setContentVisible(visible => !visible);
  }

  const TokenChange = (type: OptimismTokenType) => {
    onChange(type);
    setContentVisible(false);
  }

  // useTouchElse(titleRef, contentRef, contentVisible, setContentVisible);
  
  return (
    <div className="token-select">
      <div className="token-select-title" ref={titleRef} onClick={ToggleVisible}>{tokenType}</div>
      {contentVisible &&
        <div className="token-select-content" ref={contentRef}>
          {Object.keys(tokens[network]).map((type, index) => (
            <div key={index} className="token-box" onClick={() => TokenChange(type as OptimismTokenType)}>{type}</div>
          ))}
        </div>
      }
    </div>
  )
}