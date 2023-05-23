import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ChapterService } from '../corpus/orthography/chapter-service';
import { ChevronDown } from '../components/chevron-down';
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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setShowPopup(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const togglePopup = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        setShowPopup(!showPopup);
    }

    return (
        <div className='navigation-header'>
            <div className='chapter-name'>
                <a href='#' onClick={togglePopup}>
                    {chapterNumber}. {chapter.phonetic}
                    <ChevronDown className='down' />
                </a>
            </div>
            <div className={`chapter-popup ${showPopup ? 'show-popup' : ''}`} ref={popupRef}>
                {
                    chapterService.chapters.map(chapter => {
                        const { chapterNumber, phonetic } = chapter;
                        return (
                            <Link
                                key={chapterNumber}
                                to={`/${chapterNumber}`}
                                className='chapter-link'
                                onClick={() => setShowPopup(false)}>
                                {chapterNumber}. {phonetic}
                            </Link>
                        )
                    })
                }
            </div>
        </div>
    )
}