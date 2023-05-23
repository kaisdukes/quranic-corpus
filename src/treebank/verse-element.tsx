import { arabicNumber } from '../arabic/arabic-number';
import { Copy } from '../components/copy';
import { Verse } from '../corpus/orthography/verse';
import { VerseToken } from './verse-token';
import { formatLocationWithBrackets } from '../corpus/location';
import { Token } from '../corpus/orthography/token';
import { ChapterService } from '../corpus/orthography/chapter-service';
import { container } from 'tsyringe';
import './verse-element.scss';

type Props = {
    verse: Verse
}

export const VerseElement = ({ verse }: Props) => {
    const { location, tokens, translation } = verse;

    const handleCopy = async () => {
        const chapterService = container.resolve(ChapterService);
        const content = chapterService.copyVerse(verse);
        await navigator.clipboard.writeText(content);
    }

    const handleTokenClick = (token: Token) => {
        const root = token.root;
        const location = formatLocationWithBrackets(token.location);
        const url = `https://corpus.quran.com/qurandictionary.jsp?q=${root}#${location}`;
        window.open(url, '_blank');
    }

    return (
        <div className='verse-element'>
            <div className='verse-header'>
                <span className='verse-number'>{location[1]}</span>
                <Copy className='copy' onClick={handleCopy} />
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
                <div className='end-of-verse brown'>{arabicNumber(location[1])}</div>
            </div>
            <div className='verse-translation'>
                {translation}
            </div>
        </div>
    )
}