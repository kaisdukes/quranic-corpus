import { Ref, forwardRef } from 'react';
import { PhraseTag } from '../corpus/syntax/phrase-tag';
import { NodeElement } from './node-element';
import { Position, positionElement } from '../layout/geometry';
import './phrase-element.scss';

type Props = {
    className: string,
    tag: PhraseTag,
    position?: Position
}

export const PhraseElement = forwardRef((
    { className, tag, position }: Props,
    ref: Ref<HTMLDivElement>) => {

    return (
        <div
            ref={ref}
            className='phrase-element'
            style={positionElement(position)}>
            <NodeElement className={className} tag={tag} />
        </div>
    )
})