import { Verse } from '../corpus/orthography/verse'
import { VerseElement } from './verse-element';

type Props = {
    verses: Verse[]
}

export const DetailView = ({ verses }: Props) => (
    <>
        {
            verses.map((verse, i) => (
                <VerseElement
                    key={`verse-${i}`}
                    verse={verse} />
            ))
        }
    </>
)