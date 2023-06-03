import { Ref, forwardRef } from 'react';
import { Rect } from '../layout/geometry';
import { FontMetrics } from '../typography/font-metrics';

type Props = {
    text: string,
    fontSize: number,
    fontFamily: string,
    fontMetrics: FontMetrics,
    box?: Rect
}

export const SVGText = forwardRef((
    { text, fontSize, fontFamily, fontMetrics, box }: Props,
    ref: Ref<SVGTextElement>) => {

    return (
        <>
            <text
                ref={ref}
                x={box?.x}
                y={box ? box.y + box.height - fontMetrics.descenderHeight * fontSize : undefined}
                fontSize={fontSize}
                fontFamily={fontFamily}>
                {text}
            </text>
            {
                box &&
                <rect
                    className='box'
                    x={box.x}
                    y={box.y}
                    width={box.width}
                    height={box.height} />
            }
        </>
    )
})