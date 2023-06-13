import { Token } from '../corpus/orthography/token';
import { ArabicToken } from '../arabic/arabic-token';
import { TokenFooter } from './token-footer';
import { Link } from 'react-router-dom';
import { formatLocation } from '../corpus/orthography/location';
import './verse-token.scss';

type Props = {
    token: Token
}

export const VerseToken = ({ token }: Props) => {
    const { location } = token;
    return (
        <Link className='verse-token' to={`#${formatLocation(location)}`}>
            <ArabicToken token={token} />
            <TokenFooter token={token} />
        </Link>
    )
}