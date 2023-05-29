import { useRef, useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChapterService } from '../corpus/orthography/chapter-service';
import { ChevronDown } from '../components/chevron-down';
import { Toolbar } from './toolbar';
import { VerseSelector } from './verse-selector';
import { Qaf } from './qaf';
import { container } from 'tsyringe';
import './navigation-header.scss';

type Props = {
    chapterNumber: number
}

export const NavigationHeader = ({ chapterNumber }: Props) => {
    const [showPopup, setShowPopup] = useState(false);
    const chapterNameRef = useRef<HTMLAnchorElement | null>(null);
    const popupRef = useRef<HTMLDivElement | null>(null);
    const chapterService = container.resolve(ChapterService);
    const chapter = chapterService.getChapter(chapterNumber);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const targetElement = event.target as Node;
            if (chapterNameRef.current && chapterNameRef.current.contains(targetElement)) {
                return;
            }

            if (popupRef.current && !popupRef.current.contains(targetElement)) {
                setShowPopup(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const togglePopup = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        console.log('Toggle popup...');
        e.preventDefault();
        setShowPopup(!showPopup);
    }

    return (
        <div className='navigation-header'>
            <div className='navigation-bar'>
                <Link to='/'>
                    <Qaf />
                </Link>
                <a ref={chapterNameRef} className='chapter-name' href='#' onClick={togglePopup}>
                    {chapterNumber}. {chapter.phonetic}
                    <ChevronDown className='down' />
                </a>
                <Toolbar />
            </div>
            <VerseSelector
                ref={popupRef}
                chapterNumber={chapterNumber}
                showPopup={showPopup}
                onClickLink={() => setShowPopup(false)} />
        </div>
    )
}