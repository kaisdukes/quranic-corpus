import { Ref, forwardRef } from 'react';
import { Edge } from '../corpus/syntax/edge';
import { Position, positionElement } from '../layout/geometry';
import './edge-label.scss';

type Props = {
    edge: Edge,
    position?: Position
}

export const EdgeLabel = forwardRef((
    { edge, position }: Props,
    ref: Ref<HTMLDivElement>) => {
    return (
        <div
            ref={ref}
            className='edge-label'
            style={positionElement(position)}>
            {edge.dependencyTag}
        </div>
    )
})