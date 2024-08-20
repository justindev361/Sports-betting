interface ILeaderInfoBoxPros {
  title: string;
  info: string;
}

const LeaderInfoBox = ({ title, info }: ILeaderInfoBoxPros) => {
  return (
    <div className="leader-info-box">
      <p className="text-sm text-main-color">{title}</p>
      <p className="text-xs">{info}</p>
    </div>
  )
}

export default LeaderInfoBox