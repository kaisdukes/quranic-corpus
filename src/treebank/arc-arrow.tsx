import { Arrow } from '../layout/graph-layout';

type Props = {
    arrow: Arrow,
    className: string
}

export const ArcArrow = ({ arrow, className }: Props) => {
    const { x, y, right } = arrow;
    return (
        <polygon
            points={
                right
                    ? `${x},${y} ${x},${y + 10} ${x + 6},${y + 5}`
                    : `${x + 6},${y} ${x + 6},${y + 10} ${x},${y + 5}`
            }
            className={className} />
    )
}