import { WordByWordView } from './word-by-word-view';

type Props = {
    chapterNumber: number
}

export const WordByWord = ({ chapterNumber }: Props) => {
    return (
        <div>
            <h1>Corpus 2.0: Word by Word Test</h1>
            <p>
                This design is currently at a basic stage, serving as a color test for word segments.
            </p>
            {
                <WordByWordView chapterNumber={chapterNumber} />
            }
        </div>
    )
}