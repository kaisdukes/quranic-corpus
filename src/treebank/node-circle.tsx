import { Ref, forwardRef } from 'react';
import './node-circle.scss';

type Props = {
    className: string
}

export const NodeCircle = forwardRef(({ className }: Props, ref: Ref<HTMLDivElement>) => {
    return (<div ref={ref} className={`node-circle ${className}`} />);
})