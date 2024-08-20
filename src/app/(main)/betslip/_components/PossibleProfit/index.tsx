interface Props {
  value: number
}

export default function PossibleProfit({ value }: Props) {
  return (
    <div className="possible-profit">
      <span>Possible profit</span>
      <span>{value === 0 ? '_' : value}</span>
    </div>
  )
}