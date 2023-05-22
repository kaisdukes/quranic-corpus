import { NavigationContainer } from '../navigation/navigation-container';
import { ChapterHeader } from '../navigation/chapter-header';
import { WordByWordView } from './word-by-word-view';

type Props = {
    chapterNumber: number
}

export const WordByWord = ({ chapterNumber }: Props) => {
    return (
        <NavigationContainer header={<ChapterHeader chapterNumber={chapterNumber} />}>
            <h1>Surah {chapterNumber}</h1>
            {
                <WordByWordView chapterNumber={chapterNumber} />
            }
        </NavigationContainer>
    )
}