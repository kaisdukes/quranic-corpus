import { Fragment } from 'react';
import { Token } from '../corpus/orthography/token';
import { formatLocation } from '../corpus/orthography/location';
import './token-pane.scss';

type Props = {
    token: Token
}

export const TokenPane = ({ token }: Props) => {
    return (
        <div className='token-pane'>
            *** TEST ***<br />
            Location: {formatLocation(token.location)}<br />
            Translation: {token.translation}<br />
            Phonetic: {token.phonetic}<br />
            {token.root && <>Root: {token.root}<br /></>}
            {
                token.segments.map((segment, i) => (
                    <Fragment key={i}>
                        <br />
                        *** SEGMENT ***<br />
                        Arabic: {segment.arabic}<br />
                        POS tag: {segment.posTag}<br />
                        {segment.pronounType && <>Pronoun type: {segment.pronounType}<br /></>}
                    </Fragment>
                ))
            }
        </div>
    )
}