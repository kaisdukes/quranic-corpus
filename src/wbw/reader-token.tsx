import { Token } from '../corpus/orthography/token';
import { ArabicToken } from '../arabic/arabic-token';
import { getVerseId } from './verse-id';
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
            <ArabicToken token={token} />
        </div>
    )
}