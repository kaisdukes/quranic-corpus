import { formatLocation } from '../corpus/orthography/location';
import { Token } from '../corpus/orthography/token';
import './token-header.scss';

type Props = {
    token: Token,
    fade?: boolean
}

export const TokenHeader = ({ token, fade }: Props) => {
    const { location, translation, phonetic, root } = token;
    const locationText = formatLocation(location);
    const className = fade ? 'silver' : undefined;
    return (
        <div className='token-header'>
            <div className={className ?? 'location'}>{locationText}</div>
            <div><a className={className} href={`https://corpus.quran.com//qurandictionary.jsp?q=${root}#${locationText}`}>{phonetic}</a></div>
            <div className={className}>{translation}</div>
        </div>
    )
}