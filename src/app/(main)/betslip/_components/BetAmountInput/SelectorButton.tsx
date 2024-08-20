import './style.scss';

interface Props {
  title?: string
  value?: number
  onClick: (value: number) => void
}

export default function SelectorButton({ title, value, onClick }: Props) {
  return (
    <div className="selector-button" onClick={() => onClick(value ?? 0)}>
      {title && <div className="value-box">{title}</div>}
      {!title &&
        <>
          <div className="dollor-sign">$</div>
          <div className="value-box">{value??0}</div>
        </>
      }
    </div>
  )
}