import { Ref, forwardRef } from 'react';
import { Rect } from '../layout/geometry';
import { Font } from '../typography/font';
import { FontMetrics } from '../typography/font-metrics';
import { getTextPosition } from '../layout/text-position';

type Props = {
    text: string,
    fontSize: number,
    font: Font,
    fontMetrics: FontMetrics,
    box?: Rect,
    className?: string
}

export const SVGText = forwardRef((
    { text, fontSize, font, fontMetrics, box, className }: Props,
    ref: Ref<SVGTextElement>) => {

    const { rtl } = font;
    const position = getTextPosition(box, fontMetrics, fontSize, font.rtl);
    return (
        <>
            <text
                ref={ref}
                x={position?.x}
                y={position?.y}
                fontSize={fontSize}
                fontFamily={font.family}
                direction={rtl ? 'rtl' : undefined}
                className={className}>
                {text}
            </text>
            {
                box &&
                <rect
                    x={box.x}
                    y={box.y}
                    width={box.width}
                    height={box.height} />
            }
        </>
    )
})