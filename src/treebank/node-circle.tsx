import { Ref, forwardRef } from 'react';
import { combineClassNames } from '../theme/class-names';
import './node-circle.scss';

type Props = {
    className: string
}

export const NodeCircle = forwardRef(({ className }: Props, ref: Ref<HTMLDivElement>) => {
    return (
        <div
            ref={ref}
            className={combineClassNames('node-circle', className)} />
    )
})