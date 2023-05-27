import { IconButton } from '../components/icon-button';
import { Token } from '../corpus/orthography/token';
import { Verse } from '../corpus/orthography/verse';
import { VerseToken } from './verse-token';
import { EndOfVerse } from '../components/end-of-verse';
import { ClipboardService } from '../clipboard/clipboard-service';
import { getVerseId } from './verse-id';
import { container } from 'tsyringe';
import copy from '../images/icons/copy.svg';
import './verse-element.scss';

type Props = {
    verse: Verse,
    onClickToken: (token: Token) => void
}

export const VerseElement = ({ verse, onClickToken }: Props) => {
    const { location, tokens, translation } = verse;

    const handleCopy = async () => {
        const clipboardService = container.resolve(ClipboardService);
        await clipboardService.copyVerse(verse);
    }

    return (
        <div id={getVerseId(location)}  className='verse-element'>
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
                            onClick={() => onClickToken(token)} />
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