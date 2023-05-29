import { Ref, forwardRef } from 'react';
import { Position, positionElement } from '../layout/geometry';
import './node-tag.scss';

type Props = {
    className: string,
    tag: string,
    usePosition?: boolean,
    position?: Position
}

export const NodeTag = forwardRef((
    { className, tag, usePosition, position }: Props,
    ref: Ref<HTMLDivElement>) => {

    return (
        <div
            ref={ref}
            className={`node-tag ${className}`}
            style={usePosition ? positionElement(position) : undefined}>
            <div className='node-circle' />
            <div>{tag}</div>
        </div>
    )
})