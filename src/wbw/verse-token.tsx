import { Token } from '../corpus/orthography/token';
import { ArabicToken } from '../arabic/arabic-token';
import { TokenFooter } from './token-footer';
import './verse-token.scss';

type Props = {
    token: Token,
    onClick: () => void
}

export const VerseToken = ({ token, onClick }: Props) => {

    return (
        <div className='verse-token' onClick={onClick}>
            <ArabicToken token={token} />
            <TokenFooter token={token} />
        </div>
    )
}