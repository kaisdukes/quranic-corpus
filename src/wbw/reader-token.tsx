import { Token } from '../corpus/orthography/token';
import { TokenElement } from '../treebank/token-element';
import './reader-token.scss';

type Props = {
    token: Token,
    onClick: () => void
}

export const ReaderToken = ({ token, onClick }: Props) => {
    return (
        <div className='reader-token' onClick={onClick}>
            <TokenElement token={token} />
        </div>
    )
}