import { Ref, forwardRef, useMemo } from 'react';
import { Rect } from '../layout/geometry';
import { FontMetrics } from '../typography/font-metrics';
import { Segment } from '../corpus/morphology/segment';
import { ArabicTextService } from '../arabic/arabic-text-service';
import { ColorService } from '../theme/color-service';
import { container } from 'tsyringe';

type Props = {
    segments: Segment[],
    fontSize: number,
    fontFamily: string,
    fontMetrics: FontMetrics,
    box?: Rect
}

export const SVGSegmentedText = forwardRef((
    { segments, fontSize, fontFamily, fontMetrics, box }: Props,
    ref: Ref<SVGTextElement>) => {

    const arabicTextService = container.resolve(ArabicTextService);
    const colorService = container.resolve(ColorService);

    const joinedSegments = useMemo(() => {
        const joinedSegments = segments.map(segment => segment.arabic);
        arabicTextService.insertZeroWidthJoinersForSafari(joinedSegments);
        return joinedSegments;
    }, [segments]);

    return (
        <>
            <text
                ref={ref}
                x={box ? box.x + box.width : undefined}
                y={box ? box.y + box.height - (fontMetrics.ascenderHeight - fontMetrics.descenderHeight) * fontSize : undefined}
                fontSize={fontSize}
                fontFamily={fontFamily}
                direction='rtl'>
                {
                    segments.map((segment, i) => (
                        <tspan
                            key={i}
                            className={`segment ${colorService.getSegmentColor(segment)}`}
                            dangerouslySetInnerHTML={{ __html: joinedSegments[i]! }} />
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