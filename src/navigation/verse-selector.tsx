import { Ref, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { ChapterService } from '../corpus/orthography/chapter-service';
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
    const verseCount = chapterService.getChapter(chapterNumber).verseCount;

    return (
        <div ref={ref} className={`verse-selector ${showPopup ? 'show-popup' : ''}`}>
            <div className='list'>
                <div className='header'>Chapter</div>
                <div className='items'>
                    {
                        chapterService.chapters.map(chapter => {
                            const { chapterNumber: _chapterNumber, phonetic } = chapter;
                            return (
                                <Link
                                    key={_chapterNumber}
                                    to={`/${_chapterNumber}`}
                                    className='link'
                                    onClick={onClickLink}>
                                    {_chapterNumber}. {phonetic}
                                </Link>
                            )
                        })
                    }
                </div>
            </div>
            <div className='list'>
                <div className='header'>Verse</div>
                <div className='items'>
                    {
                        Array.from({ length: verseCount }, (_, i) => i + 1).map(verseNumber => (
                            <Link
                                key={verseNumber}
                                to={`/${chapterNumber}:${verseNumber}`}
                                className='link'
                                onClick={onClickLink}>
                                {verseNumber}
                            </Link>
                        ))
                    }
                </div>
            </div>
        </div>
    )

})