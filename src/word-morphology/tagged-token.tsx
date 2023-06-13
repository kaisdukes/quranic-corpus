import { Fragment } from 'react';
import { Token } from '../corpus/orthography/token';
import { ArabicToken } from '../arabic/arabic-token';
import './tagged-token.scss';

type Props = {
    token: Token
}

export const TaggedToken = ({ token }: Props) => {
    return (
        <div className='tagged-token'>
            {token.location}<br />
            {token.translation}<br />
            {token.phonetic}<br />
            <ArabicToken token={token} />
            {
                token.segments.map((segment, i) => (
                    <Fragment key={`pos-${i}`}>{segment.posTag}<br /></Fragment>
                ))
            }
        </div>
    )
}