interface Props {
  title: string
  onClick: () => void
}

export default function PlaceButton({ title, onClick }: Props) {
  return (
    <div className="place-button" onClick={onClick}>
      {title}
    </div>
  )
}