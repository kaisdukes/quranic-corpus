import { useMemo } from 'react';
import { Token } from '../corpus/orthography/token';
import { ArabicTextService } from '../arabic/arabic-text-service';
import { ColorService } from '../theme/color-service';
import { container } from 'tsyringe';
import './arabic-token.scss';

type Props = {
    token: Token,
    fade?: boolean
}

export const ArabicToken = ({ token, fade }: Props) => {
    const arabicTextService = container.resolve(ArabicTextService);
    const colorService = container.resolve(ColorService);

    const { segments } = token;

    const joinedSegments = useMemo(() => {
        const joinedSegments = segments.map(segment => segment.arabic);
        arabicTextService.insertZeroWidthJoinersForSafari(joinedSegments);
        return joinedSegments;
    }, [segments]);

    return (
        <div className='arabic-token'>
            {
                segments.map((segment, i) => {
                    const joinedSegment = joinedSegments[i];
                    return joinedSegment
                        ? (
                            <span
                                key={`segment-${i}`}
                                className={`segment ${fade ? 'silver' : colorService.getSegmentColor(segment)}`}
                                dangerouslySetInnerHTML={{ __html: joinedSegment }} />
                        )
                        : null;
                })
            }
        </div>
    )
}