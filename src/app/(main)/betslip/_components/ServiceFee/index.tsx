import './style.scss';

interface Props {
  value: number
}

export default function ServiceFee({ value }: Props) {
  return (
    <div className="service-fee">
      <span>Gas price</span>
      <span>{value === 0 ? '_' : value.toFixed(8)} Gwei</span>
    </div>
  )
}