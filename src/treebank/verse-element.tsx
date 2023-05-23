import { arabicNumber } from '../arabic/arabic-number';
import { Copy } from '../components/copy';
import { Verse } from '../corpus/orthography/verse';
import { TokenElement } from './token-element';
import { TokenFooter } from './token-footer';
import './verse-element.scss';

type Props = {
    verse: Verse
}

export const VerseElement = ({ verse }: Props) => {
    const { location, tokens, translation } = verse;

    return (
        <div className='verse-element'>
            <div className='verse-header'>
                <span className='verse-number'>{location[1]}</span>
                <Copy className='copy'/>
            </div>
            <div className='verse-tokens'>
                {
                    tokens.map((token, i) => (
                        <div className='token-container'>
                            <TokenElement
                                key={`token-${i}`}
                                token={token} />
                            <TokenFooter token={token} />
                        </div>
                    ))
                }
                <div className='end-of-verse brown'>{arabicNumber(location[1])}</div>
            </div>
            <div className='verse-translation'>
                {translation}
            </div>
        </div>
    )
}