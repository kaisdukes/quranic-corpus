import { Token } from '../corpus/orthography/token';
import { Verse } from '../corpus/orthography/verse'
import { VerseElement } from './verse-element';

type Props = {
    verses: Verse[],
    onClickToken: (token: Token) => void
}

export const DetailView = ({ verses, onClickToken }: Props) => (
    <>
        {
            verses.map((verse, i) => (
                <VerseElement
                    key={`verse-${i}`}
                    verse={verse}
                    onClickToken={onClickToken} />
            ))
        }
    </>
)