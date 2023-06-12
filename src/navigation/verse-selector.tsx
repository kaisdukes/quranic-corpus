import { Link, useLocation } from 'react-router-dom';
import { ChapterService } from '../corpus/orthography/chapter-service';
import { SelectorList } from './selector-list';
import { getPagePath } from './navigation';
import { container } from 'tsyringe';
import './verse-selector.scss';

type Props = {
    chapterNumber: number,
    onClose: () => void
}

export const VerseSelector = ({ chapterNumber, onClose }: Props) => {
    const chapterService = container.resolve(ChapterService);
    const chapters = chapterService.chapters;
    const verseCount = chapterService.getChapter(chapterNumber).verseCount;
    const url = getPagePath(useLocation());

    return (
        <div className='verse-selector'>
            <SelectorList
                header='Chapter'
                length={chapters.length}
                renderItem={i => {
                    const { chapterNumber, phonetic } = chapters[i];
                    return (
                        <Link
                            key={chapterNumber}
                            to={`${url}/${chapterNumber}`}
                            className='link'
                            onClick={onClose}>
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
                            to={`${url}/${chapterNumber}:${verseNumber}`}
                            className='link'
                            onClick={onClose}>
                            {verseNumber}
                        </Link>
                    )
                }} />
        </div>
    )
}