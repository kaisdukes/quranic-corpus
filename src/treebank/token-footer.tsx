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
            <div className='phonetic'>
                {
                    root
                        ? <a href={`https://corpus.quran.com//qurandictionary.jsp?q=${root}#${locationText}`}>{phonetic}</a>
                        : phonetic
                }
            </div>
            <div>{translation}</div>
        </div>
    )
}