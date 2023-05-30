import { useRef } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChapterService } from '../corpus/orthography/chapter-service';
import { ChevronDown } from '../components/chevron-down';
import { Toolbar } from './toolbar';
import { Qaf } from './qaf';
import { PopupLink } from '../components/popup-link';
import { PopupMenu } from '../components/popup-menu';
import { VerseSelector } from './verse-selector';
import { container } from 'tsyringe';
import './navigation-header.scss';

type Props = {
    chapterNumber: number
}

export const NavigationHeader = ({ chapterNumber }: Props) => {
    const [showPopup, setShowPopup] = useState(false);
    const popupRef = useRef<HTMLDivElement | null>(null);
    const chapterService = container.resolve(ChapterService);
    const chapter = chapterService.getChapter(chapterNumber);

    return (
        <div className='navigation-header'>
            <div className='navigation-bar'>
                <Link to='/'><Qaf /></Link>
                <PopupLink
                    className='chapter-name'
                    popupRef={popupRef}
                    showPopup={showPopup}
                    onShowPopup={setShowPopup}>
                    {chapterNumber}. {chapter.phonetic}
                    <ChevronDown className='down' />
                </PopupLink>
                <Toolbar />
            </div>
            <PopupMenu ref={popupRef} showPopup={showPopup}>
                <VerseSelector
                    chapterNumber={chapterNumber}
                    onClickLink={() => setShowPopup(false)} />
            </PopupMenu>
        </div>
    )
}