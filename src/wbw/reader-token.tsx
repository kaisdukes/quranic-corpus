import { Token } from '../corpus/orthography/token';
import { TokenElement } from '../treebank/token-element';
import { getVerseId } from '../treebank/verse-id';
import './reader-token.scss';

type Props = {
    token: Token,
    onClick: () => void
}

export const ReaderToken = ({ token, onClick }: Props) => {
    const { location } = token;
    return (
        <div
            id={location[2] === 1 ? getVerseId(location) : undefined}
            className='reader-token'
            onClick={onClick}>
            <TokenElement token={token} />
        </div>
    )
}