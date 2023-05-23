import { Token } from '../corpus/orthography/token';
import { TokenElement } from './token-element';
import { TokenFooter } from './token-footer';
import './verse-token.scss';

type Props = {
    token: Token,
    onClick: () => void
}

export const VerseToken = ({ token, onClick }: Props) => {

    return (
        <div className='verse-token' onClick={onClick}>
            <TokenElement token={token} />
            <TokenFooter token={token} />
        </div>
    )
}