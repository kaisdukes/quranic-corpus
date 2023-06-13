import { combineClassNames } from '../theme/class-names';
import './node-circle.scss';

type Props = {
    className: string
}

export const NodeCircle = ({ className }: Props) => {
    return (<div className={combineClassNames('node-circle', className)} />)
}