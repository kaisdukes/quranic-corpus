import { formatLocation } from '../corpus/location';
import { Verse } from '../corpus/orthography/verse';
import { TokenElement } from './token-element';
import './verse-element.scss';

type Props = {
    verse: Verse
}

export const VerseElement = ({ verse }: Props) => {
    const { location, tokens } = verse;

    return (
        <div className='verse-element'>
            <div className='verse-header'>
                <div className='verse-number'>
                    {formatLocation(location)}
                </div>
            </div>
            <div className='tokens'>
                {
                    tokens.map((token, i) => (
                        <TokenElement
                            key={`token-${i}`}
                            token={token} />
                    ))
                }
            </div>
        </div>
    )
}