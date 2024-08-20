import './style.scss';
import NoBets from "@/components/NoBets"
import { Position, PositionType } from "@/lib/types/overtime"

interface Props {
  positions: { [key in PositionType]: Position[] }
  loading: boolean
  SingleCard: (props: Position) => JSX.Element
  ParlayCard: (props: Position) => JSX.Element
}

export default function PositionBox({ positions, loading, SingleCard, ParlayCard }: Props) {
  if (loading) {
    return <div className="loading-text">
      Loading
    </div>
  }

  if ((positions.singles.length + positions.parlays.length) === 0) {
    return <NoBets />
  }

  return (
    <div className="position-box">
      {positions.singles.map((pos, index) => <SingleCard key={index} {...pos} />)}
      {positions.parlays.map((pos, index) => <ParlayCard key={index} {...pos} />)}
    </div>
  );
}