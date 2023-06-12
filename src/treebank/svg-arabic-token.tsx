import { Ref, forwardRef, useMemo } from 'react';
import { Rect } from '../layout/geometry';
import { Font } from '../typography/font';
import { FontMetrics } from '../typography/font-metrics';
import { Token } from '../corpus/orthography/token';
import { ArabicTextService } from '../arabic/arabic-text-service';
import { ColorService } from '../theme/color-service';
import { getTextPosition } from '../layout/text-position';
import { container } from 'tsyringe';

type Props = {
    token: Token,
    fontSize: number,
    font: Font,
    fontMetrics: FontMetrics,
    box?: Rect,
    fade: boolean
}

export const SVGArabicToken = forwardRef((
    { token, fontSize, font, fontMetrics, box, fade }: Props,
    ref: Ref<SVGTextElement>) => {

    const arabicTextService = container.resolve(ArabicTextService);
    const colorService = container.resolve(ColorService);
    const { segments } = token;

    const joinedSegments = useMemo(() => {
        const joinedSegments = segments.map(segment => segment.arabic);
        arabicTextService.insertZeroWidthJoinersForSafari(joinedSegments);
        return joinedSegments;
    }, [segments]);

    const position = getTextPosition(box, fontMetrics, fontSize, true);
    return (
        <text
            ref={ref}
            x={position?.x}
            y={position?.y}
            fontSize={fontSize}
            fontFamily={font.family}
            direction={'rtl'}>
            {
                segments.map((segment, i) => (
                    <tspan
                        key={i}
                        className={fade ? 'silver' : colorService.getSegmentColor(segment)}
                        dangerouslySetInnerHTML={{ __html: joinedSegments[i]! }} />
                ))
            }
        </text>
    )
})