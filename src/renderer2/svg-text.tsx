import { Ref, forwardRef } from 'react';
import { Rect } from '../layout/geometry';

type Props = {
    text: string,
    fontFamily: string,
    fontSize: number,
    descenderHeight: number,
    box?: Rect
}

export const SVGText = forwardRef((
    { text, fontFamily, fontSize, descenderHeight, box }: Props,
    ref: Ref<SVGTextElement>) => {

    return (
        <>
            <text
                ref={ref}
                x={box?.x}
                y={box ? box.y + box.height - descenderHeight * fontSize : undefined}
                fontFamily={fontFamily}
                fontSize={fontSize}>
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