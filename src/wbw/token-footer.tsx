import { Token } from '../corpus/orthography/token';
import './token-footer.scss';

type Props = {
    token: Token
}

export const TokenFooter = ({ token }: Props) => {
    const { translation, phonetic } = token;
    return (
        <div className='token-footer'>
            <div className='phonetic'>{phonetic}</div>
            <div>{translation}</div>
        </div>
    )
}