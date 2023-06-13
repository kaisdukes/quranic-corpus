import { Token } from '../corpus/orthography/token';
import { formatLocation } from '../corpus/orthography/location';
import './token-header.scss';

type Props = {
    token: Token
}

export const TokenHeader = ({ token }: Props) => {
    const { location, translation, phonetic } = token;
    return (
        <div className='token-header'>
            <div className='location'>{formatLocation(location)}</div>
            <div className='phonetic'>{phonetic}</div>
            <div>{translation}</div>
        </div>
    )
}