import { useRef } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChapterService } from '../corpus/orthography/chapter-service';
import { ChevronDown } from '../components/chevron-down';
import { Qaf } from './qaf';
import { PopupLink } from '../components/popup-link';
import { PopupMenu } from '../components/popup-menu';
import { VerseSelector } from './verse-selector';
import { HamburgerMenu } from './hamburger-menu';
import { container } from 'tsyringe';
import hamburger from './../images/icons/hamburger.svg'
import './navigation-bar.scss';

export type NavigationProps = {
    chapterNumber: number
}

export const NavigationBar = ({ chapterNumber }: NavigationProps) => {
    const [showVerseSelectorPopup, setShowVerseSelectorPopup] = useState(false);
    const verseSelectorPopupRef = useRef<HTMLDivElement | null>(null);

    const [showHamburgerPopup, setShowHamburgerPopup] = useState(false);
    const hamburgerPopupRef = useRef<HTMLDivElement | null>(null);

    const chapterService = container.resolve(ChapterService);
    const chapter = chapterService.getChapter(chapterNumber);

    return (
        <nav>
            <div className='navigation-bar'>
                <Link to='/'><Qaf /></Link>
                <PopupLink
                    className='chapter-name'
                    popupRef={verseSelectorPopupRef}
                    showPopup={showVerseSelectorPopup}
                    onShowPopup={setShowVerseSelectorPopup}>
                    {chapterNumber}. {chapter.phonetic}
                    <ChevronDown className='down' />
                </PopupLink>
                <PopupLink
                    className='hamburger'
                    popupRef={hamburgerPopupRef}
                    showPopup={showHamburgerPopup}
                    onShowPopup={setShowHamburgerPopup}>
                    <img src={hamburger} />
                </PopupLink>
            </div>
            <PopupMenu ref={verseSelectorPopupRef} showPopup={showVerseSelectorPopup}>
                <VerseSelector
                    chapterNumber={chapterNumber}
                    onClose={() => setShowVerseSelectorPopup(false)} />
            </PopupMenu>
            <PopupMenu ref={hamburgerPopupRef} showPopup={showHamburgerPopup}>
                <HamburgerMenu onClose={() => setShowHamburgerPopup(false)} />
            </PopupMenu>
        </nav>
    )
}