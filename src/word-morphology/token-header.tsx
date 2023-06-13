import { Token } from '../corpus/orthography/token';
import { formatLocationWithBrackets } from '../corpus/orthography/location';
import './token-header.scss';

type Props = {
    token: Token
}

export const TokenHeader = ({ token }: Props) => {
    const { location, translation, phonetic } = token;
    return (
        <div className='token-header'>
            <div className='location'>{formatLocationWithBrackets(location)}</div>
            <div>{translation}</div>
            <div className='phonetic'>{phonetic}</div>
        </div>
    )
}