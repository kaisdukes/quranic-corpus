import { Ref, forwardRef } from 'react';
import { Position } from '../layout/geometry';

type Props = {
    word: string,
    position: Position
}

export const SVGWord = forwardRef((
    { word, position }: Props,
    ref: Ref<SVGTextElement>) => {
    const { x, y } = position;

    return (
        <text ref={ref} x={x} y={y}>
            {word}
        </text>
    )
})