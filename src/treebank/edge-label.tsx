import { Ref, forwardRef } from 'react';
import { Edge } from '../corpus/syntax/edge';
import { Position } from '../layout/geometry';
import { renderOffScreen } from '../theme/styles';
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
            style={
                position
                    ? {
                        position: 'absolute',
                        left: position.x,
                        top: position.y
                    }
                    : renderOffScreen
            }>
            {edge.dependencyTag}
        </div>
    )
})