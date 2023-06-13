import { Fragment } from 'react';
import { Token } from '../corpus/orthography/token';
import { TokenHeader } from './token-header';
import { ArabicToken } from '../arabic/arabic-token';
import './tagged-token.scss';

type Props = {
    token: Token
}

export const TaggedToken = ({ token }: Props) => {
    return (
        <div className='tagged-token'>
            <TokenHeader token={token} />
            <ArabicToken token={token} />
            {
                token.segments.map((segment, i) => (
                    <Fragment key={`pos-${i}`}>{segment.posTag}<br /></Fragment>
                ))
            }
        </div>
    )
}