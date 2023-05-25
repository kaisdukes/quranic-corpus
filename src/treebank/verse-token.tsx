import { Token } from '../corpus/orthography/token';
import { TokenElement } from './token-element';
import { TokenFooter } from './token-footer';
import './verse-token.scss';

type Props = {
    token: Token,
    readerMode: boolean,
    onClick: () => void
}

export const VerseToken = ({ token, readerMode, onClick }: Props) => {

    return (
        <div className='verse-token' onClick={onClick}>
            <TokenElement token={token} />
            {!readerMode && <TokenFooter token={token} />}
        </div>
    )
}