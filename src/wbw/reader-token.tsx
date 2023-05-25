import { Token } from '../corpus/orthography/token';
import { TokenElement } from '../treebank/token-element';
import './reader-token.scss';

type Props = {
    token: Token
}

export const ReaderToken = ({ token }: Props) => {
    return (
        <div className='reader-token'>
            <TokenElement token={token}/>
        </div>
    )
}