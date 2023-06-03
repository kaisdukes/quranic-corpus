import { Ref, forwardRef } from 'react';
import { Rect } from '../layout/geometry';
import { FontMetrics } from '../typography/font-metrics';

type Props = {
    segments: string[],
    classNames: string[],
    fontSize: number,
    fontFamily: string,
    fontMetrics: FontMetrics,
    box?: Rect
}

export const SVGSegmentedText = forwardRef((
    { segments, classNames, fontSize, fontFamily, fontMetrics, box }: Props,
    ref: Ref<SVGTextElement>) => {

    return (
        <>
            <text
                ref={ref}
                x={box ? box.width - box.x : undefined}
                y={box ? box.y + box.height - (fontMetrics.ascenderHeight - fontMetrics.descenderHeight) * fontSize : undefined}
                fontSize={fontSize}
                fontFamily={fontFamily}
                direction='rtl'>
                {
                    segments.map((segment, i) => (
                        <tspan
                            key={i}
                            className={classNames[i]}
                            dangerouslySetInnerHTML={{ __html: segment }} />
                    ))
                }
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
