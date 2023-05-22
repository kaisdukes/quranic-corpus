import { NavigationContainer } from '../navigation/navigation-container';
import { ChapterHeader } from '../navigation/chapter-header';
import { WordByWordView } from './word-by-word-view';

type Props = {
    chapterNumber: number
}

export const WordByWord = ({ chapterNumber }: Props) => {
    return (
        <NavigationContainer header={<ChapterHeader />}>
            <h1>Corpus 2.0: Word by Word Test</h1>
            <p>
                This design is currently at a basic stage, serving as a color test for word segments.
            </p>
            {
                <WordByWordView chapterNumber={chapterNumber} />
            }
        </NavigationContainer>
    )
}