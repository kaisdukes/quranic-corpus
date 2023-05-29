import { Ref, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { ChapterService } from '../corpus/orthography/chapter-service';
import { SelectorList } from './selector-list';
import { container } from 'tsyringe';
import './verse-selector.scss';

type Props = {
    chapterNumber: number,
    showPopup: boolean,
    onClickLink: () => void
}

export const VerseSelector = forwardRef((
    { chapterNumber, showPopup, onClickLink }: Props,
    ref: Ref<HTMLDivElement>) => {
    const chapterService = container.resolve(ChapterService);
    const chapters = chapterService.chapters;
    const verseCount = chapterService.getChapter(chapterNumber).verseCount;

    return (
        <div ref={ref} className={`verse-selector ${showPopup ? 'show-popup' : ''}`}>
            <SelectorList
                header='Chapter'
                length={chapters.length}
                renderItem={i => {
                    const { chapterNumber, phonetic } = chapters[i];
                    return (
                        <Link
                            key={chapterNumber}
                            to={`/${chapterNumber}`}
                            className='link'
                            onClick={onClickLink}>
                            {chapterNumber}. {phonetic}
                        </Link>
                    )
                }} />
            <SelectorList
                header='Verse'
                length={verseCount}
                renderItem={i => {
                    const verseNumber = i + 1;
                    return (
                        <Link
                            key={verseNumber}
                            to={`/${chapterNumber}:${verseNumber}`}
                            className='link'
                            onClick={onClickLink}>
                            {verseNumber}
                        </Link>
                    )
                }} />
        </div>
    )

})