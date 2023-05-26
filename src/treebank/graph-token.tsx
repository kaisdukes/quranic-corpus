import { Ref, RefObject, forwardRef, useMemo } from 'react';
import { Token } from '../corpus/orthography/token';
import { TokenHeader } from './token-header';
import { Position } from '../layout/geometry';
import { NodeCircle } from './node-circle';
import { ArabicTextService } from '../arabic/arabic-text-service';
import { ArabicToken } from '../arabic/arabic-token';
import { ColorService } from '../theme/color-service';
import { container } from 'tsyringe';
import './graph-token.scss';

type Props = {
    token: Token,
    segmentCircleRefs: RefObject<HTMLDivElement>[]
    position?: Position
}

export const GraphToken = forwardRef((
    { token, segmentCircleRefs, position }: Props,
    ref: Ref<HTMLDivElement>) => {

    const arabicTextService = container.resolve(ArabicTextService);
    const colorService = container.resolve(ColorService);

    const { segments } = token;

    const joinedSegments = useMemo(() => {
        const joinedSegments = segments.map(segment => segment.arabic);
        arabicTextService.insertZeroWidthJoinersForSafari(joinedSegments);
        return joinedSegments;
    }, [segments]);

    return (
        <div
            ref={ref}
            className='graph-token'
            style={
                position
                    ? {
                        position: 'absolute',
                        left: position.x,
                        top: position.y
                    }
                    : { marginLeft: '-9999px' } // Render off-screen initially
            }>
            <div className='token-content'>
                <TokenHeader token={token} />
                <ArabicToken token={token}/>
                <div className='pos-tag-container'>
                    {
                        (() => {
                            const posTags = [];
                            let circleIndex = segmentCircleRefs.length - 1;
                            for (let i = segments.length - 1; i >= 0; i--) {
                                const segment = segments[i];
                                const color = colorService.getSegmentColor(segment);
                                if (segment.posTag !== 'DET') {
                                    posTags.push(
                                        <div key={`circle-${i}`} className='pos-tag'>
                                            <NodeCircle
                                                ref={segmentCircleRefs[circleIndex--]}
                                                className={color} />
                                            <div className={color}>
                                                {segment.posTag}
                                            </div>
                                        </div>
                                    );
                                }
                            }
                            return posTags;
                        })()
                    }
                </div>
            </div>
        </div>
    )
})