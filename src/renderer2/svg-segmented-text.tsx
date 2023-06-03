import { Ref, forwardRef, useMemo } from 'react';
import { Rect } from '../layout/geometry';
import { Font } from '../typography/font';
import { FontMetrics } from '../typography/font-metrics';
import { Segment } from '../corpus/morphology/segment';
import { ArabicTextService } from '../arabic/arabic-text-service';
import { ColorService } from '../theme/color-service';
import { getTextPosition } from '../layout/text-position';
import { container } from 'tsyringe';

type Props = {
    segments: Segment[],
    fontSize: number,
    font: Font,
    fontMetrics: FontMetrics,
    box?: Rect
}

export const SVGSegmentedText = forwardRef((
    { segments, fontSize, font, fontMetrics, box }: Props,
    ref: Ref<SVGTextElement>) => {

    const arabicTextService = container.resolve(ArabicTextService);
    const colorService = container.resolve(ColorService);

    const joinedSegments = useMemo(() => {
        const joinedSegments = segments.map(segment => segment.arabic);
        arabicTextService.insertZeroWidthJoinersForSafari(joinedSegments);
        return joinedSegments;
    }, [segments]);

    const { rtl } = font;
    const position = getTextPosition(box, fontMetrics, fontSize, rtl);
    return (
        <>
            <text
                ref={ref}
                x={position?.x}
                y={position?.y}
                fontSize={fontSize}
                fontFamily={font.family}
                direction={rtl ? 'rtl' : undefined}>
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