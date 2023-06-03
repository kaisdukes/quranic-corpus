import { Ref, forwardRef } from 'react';
import { Position } from '../layout/geometry';

type Props = {
    word: string,
    position?: Position
}

export const SVGWord = forwardRef((
    { word, position }: Props,
    ref: Ref<SVGTextElement>) => {

    return (
        <text ref={ref} x={position?.x} y={position?.y}>
            {word}
        </text>
    )
})