import { Verse } from '../corpus/orthography/verse';
import { TokenElement } from './token-element';
import './verse-element.scss';

type Props = {
    verse: Verse
}

export const VerseElement = ({ verse }: Props) => {
    const { tokens } = verse;

    return (
        <div className='verse-element'>
            {
                tokens.map((token, i) => (
                    <TokenElement
                        key={`token-${i}`}
                        token={token} />
                ))
            }
        </div>
    )
}