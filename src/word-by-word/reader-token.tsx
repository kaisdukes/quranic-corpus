import { Token } from '../corpus/orthography/token';
import { ArabicToken } from '../arabic/arabic-token';
import { Link } from 'react-router-dom';
import { formatLocation } from '../corpus/orthography/location';
import { getVerseId } from './verse-id';
import './reader-token.scss';

type Props = {
    token: Token
}

export const ReaderToken = ({ token }: Props) => {
    const { location } = token;
    return (
        <Link
            id={location[2] === 1 ? getVerseId(location) : undefined}
            className='reader-token'
            to={`#${formatLocation(location)}`}>
            <ArabicToken token={token} />
        </Link>
    )
}