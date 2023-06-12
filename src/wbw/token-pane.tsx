import { Fragment } from 'react';
import { Token } from '../corpus/orthography/token';
import { CloseButton } from '../components/close-button';
import { formatLocation } from '../corpus/orthography/location';
import './token-pane.scss';

type Props = {
    token: Token,
    onClose: () => void
}

export const TokenPane = ({ token, onClose }: Props) => {
    return (
        <div className='token-pane'>
            <CloseButton onClick={onClose} /><br />
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