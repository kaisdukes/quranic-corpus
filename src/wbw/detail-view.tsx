import { Token } from '../corpus/orthography/token';
import { Verse } from '../corpus/orthography/verse'
import { VerseElement } from '../treebank/verse-element';

type Props = {
    verses: Verse[],
    onClickToken: (token: Token) => void
}

export const DetailView = ({ verses, onClickToken }: Props) => (
    <>
        {
            verses.map((verse, i) => (
                <VerseElement
                    key={`verse-${verse.location[0]}:${verse.location[1]}`}
                    verse={verse}
                    onClickToken={onClickToken} />
            ))
        }
    </>
)