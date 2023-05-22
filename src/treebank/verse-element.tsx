import { arabicNumber } from '../arabic/arabic-number';
import { formatLocation } from '../corpus/location';
import { Verse } from '../corpus/orthography/verse';
import { TokenElement } from './token-element';
import './verse-element.scss';

type Props = {
    verse: Verse
}

export const VerseElement = ({ verse }: Props) => {
    const { location, tokens, translation } = verse;

    return (
        <div className='verse-element'>
            <div className='verse-arabic'>
                <div className='verse-number'>{location[1]}</div>
                <div className='tokens'>
                    {
                        tokens.map((token, i) => (
                            <TokenElement
                                key={`token-${i}`}
                                token={token} />
                        ))
                    }
                    <div className='end-of-verse brown'>{arabicNumber(location[1])}</div>
                </div>
            </div>
            <div className='verse-translation'>
                {translation}
            </div>
        </div>
    )
}