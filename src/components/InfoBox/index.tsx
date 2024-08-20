import './style.scss';
import useAppContext from "@/lib/hooks/useAppContext"
import { Field, Market } from "@/lib/types/overtime"

interface Props {
  title: string
  field: Field
  value: string | number
  market: Market
  onClick: VoidFunction
}

export default function InfoBox({ title, field, value, market, onClick }: Props) {
  const { data } = useAppContext();
  const selected = data.positions.find(p => p.market.address === market.address && p.position === field);

  return (
    <div className={`info-box ${selected ? 'selected' : ''}`} onClick={onClick}>
      <span className="field-text">{title}</span>
      <span className="value-text">{value}</span>
    </div>
  )
}