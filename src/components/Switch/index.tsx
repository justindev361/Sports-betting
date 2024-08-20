import './style.scss';

interface Props {
  title?: string
  selected: boolean
  onChange: (selected: boolean) => void
}

export default function Switch({ title, selected, onChange }: Props) {
  const Click = () => {
    onChange && onChange(!selected);
  }

  return (
    <div className="j-switch" onClick={Click} data-selected={selected}>
      {title && <div className="title-box">{title}</div>}
      <div className="switch-body">
        <div className="select-circle"></div>
      </div>
    </div>
  )
}