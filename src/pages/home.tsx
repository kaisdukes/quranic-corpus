import { useEffect, useState } from 'react';
import { WordByWordView } from '../wbw/word-by-word-view';
import { NavigationService } from '../navigation/navigation-service';
import { container } from 'tsyringe';

export const Home = () => {
    const navigationService = container.resolve(NavigationService);
    const [chapterNumber, setChapterNumber] = useState<number>();

    useEffect(() => {
        const chapterNumber = navigationService.getChapterNumber();
        if (chapterNumber && chapterNumber >= 1 && chapterNumber <= 114) {
            setChapterNumber(chapterNumber);
        }
    }, []);

    return (
        <div className='home'>
            <h1>Corpus 2.0: Word by Word Test</h1>
            <p>
                This design is currently at a basic stage, serving as a color test for word segments.
                Rest assured, this is not the final appearance, which will undergo significant enhancements.
            </p>
            {
                chapterNumber &&
                <WordByWordView chapterNumber={chapterNumber} />
            }
        </div>
    )
}