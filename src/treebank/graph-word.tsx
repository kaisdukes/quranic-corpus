import { Ref, RefObject, forwardRef } from 'react';
import { Word } from '../corpus/syntax/word';
import { TokenHeader } from './token-header';
import { Position, positionElement } from '../layout/geometry';
import { NodeElement } from './node-element';
import { ArabicToken } from '../arabic/arabic-token';
import { ColorService } from '../theme/color-service';
import { container } from 'tsyringe';
import './graph-word.scss';

type Props = {
    word: Word,
    posTagRefs: RefObject<HTMLDivElement>[]
    position?: Position
}

export const GraphWord = forwardRef((
    { word, posTagRefs, position }: Props,
    ref: Ref<HTMLDivElement>) => {

    const colorService = container.resolve(ColorService);
    const { type, token, hiddenText, hiddenPosTag } = word;
    const fade = type === 'reference';

    return (
        <div
            ref={ref}
            className='graph-word'
            style={positionElement(position)}>
            <div className='word-content'>
                {
                    token
                        ? <>
                            <TokenHeader token={token} fade={fade} />
                            <ArabicToken token={token} fade={fade} />
                            <div className='pos-tag-container'>
                                {
                                    (() => {
                                        const { segments } = token;
                                        const posTags = [];
                                        let posTagIndex = posTagRefs.length - 1;
                                        for (let i = segments.length - 1; i >= 0; i--) {
                                            const segment = segments[i];
                                            if (segment.posTag !== 'DET') {
                                                posTags.push(
                                                    <NodeElement
                                                        key={`tag-${i}`}
                                                        ref={posTagRefs[posTagIndex--]}
                                                        className={fade ? 'silver' : colorService.getSegmentColor(segment)}
                                                        tag={segment.posTag} />
                                                )
                                            }
                                        }
                                        return posTags;
                                    })()
                                }
                            </div>
                        </>
                        :
                        <>
                            <div className='arabic-token hidden-word silver-light'>
                                {
                                    hiddenText ?
                                        <>
                                            <span className='pre'>(</span>
                                            {hiddenText}
                                            <span className='pre'>)</span>
                                        </>
                                        : <span className='pre'>(*)</span>
                                }
                            </div>
                            <div className='pos-tag-container'>
                                <NodeElement
                                    ref={posTagRefs[0]}
                                    className='silver-light'
                                    tag={hiddenPosTag!} />
                            </div>
                        </>
                }
            </div>
        </div>
    )
})