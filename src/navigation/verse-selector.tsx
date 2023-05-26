import { Ref, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { ChapterService } from '../corpus/orthography/chapter-service';
import { container } from 'tsyringe';
import './verse-selector.scss';

type Props = {
    showPopup: boolean,
    onClickLink: () => void
}

export const VerseSelector = forwardRef((
    { showPopup, onClickLink }: Props,
    ref: Ref<HTMLDivElement>) => {
    const chapterService = container.resolve(ChapterService);
    return (
        <div ref={ref} className={`verse-selector ${showPopup ? 'show-popup' : ''}`}>
            {
                chapterService.chapters.map(chapter => {
                    const { chapterNumber, phonetic } = chapter;
                    return (
                        <Link
                            key={chapterNumber}
                            to={`/${chapterNumber}`}
                            className='chapter-link'
                            onClick={onClickLink}>
                            {chapterNumber}. {phonetic}
                        </Link>
                    )
                })
            }
        </div>
    )
})