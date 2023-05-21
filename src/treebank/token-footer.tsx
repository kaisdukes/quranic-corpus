import { formatLocationWithBrackets } from '../corpus/location';
import { Token } from '../corpus/orthography/token';
import './token-footer.scss';

type Props = {
    token: Token
}

export const TokenFooter = ({ token }: Props) => {
    const { location, translation, phonetic, root } = token;
    const locationText = formatLocationWithBrackets(location);
    return (
        <div className='token-footer'>
            <div><a href={`https://corpus.quran.com//qurandictionary.jsp?q=${root}#${locationText}`}>{phonetic}</a></div>
            <div>{translation}</div>
        </div>
    )
}