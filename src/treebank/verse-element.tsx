import { arabicNumber } from '../arabic/arabic-number';
import { IconButton } from '../components/icon-button';
import { Verse } from '../corpus/orthography/verse';
import { VerseToken } from './verse-token';
import { formatLocationWithBrackets } from '../corpus/location';
import { Token } from '../corpus/orthography/token';
import { EndOfVerse } from './end-of-verse';
import { ClipboardService } from '../clipboard/clipboard-service';
import { container } from 'tsyringe';
import copy from '../images/icons/copy.svg';
import './verse-element.scss';

type Props = {
    verse: Verse
}

export const VerseElement = ({ verse }: Props) => {
    const { location, tokens, translation } = verse;

    const handleCopy = async () => {
        const clipboardService = container.resolve(ClipboardService);
        await clipboardService.copyVerse(verse);
    }

    const handleTokenClick = (token: Token) => {
        const root = token.root;
        if (!root) return;
        const location = formatLocationWithBrackets(token.location);
        const url = `https://corpus.quran.com/qurandictionary.jsp?q=${root}#${location}`;
        window.open(url, '_blank');
    }

    return (
        <div className='verse-element'>
            <div className='verse-header'>
                <span className='verse-number'>{location[1]}</span>
                <IconButton className='copy-button' icon={copy} onClick={handleCopy} />
            </div>
            <div className='verse-tokens'>
                {
                    tokens.map((token, i) => (
                        <VerseToken
                            key={`token-${i}`}
                            token={token}
                            onClick={() => handleTokenClick(token)} />
                    ))
                }
                <EndOfVerse verseNumber={location[1]} />
            </div>
            <div className='verse-translation'>
                {translation}
            </div>
        </div>
    )
}