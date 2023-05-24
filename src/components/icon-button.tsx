import './icon-button.scss';

type Props = {
  className?: string,
  icon: string,
  onClick: () => void
}

export const IconButton = ({ className, icon, onClick }: Props) => (
  <img className={`icon-button ${className}`} src={icon} onClick={onClick} />
)