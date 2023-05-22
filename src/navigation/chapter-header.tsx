import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import './chapter-header.scss';

type Props = {
    chapterNumber: number
}

export const ChapterHeader = ({ chapterNumber }: Props) => {
    const [showPopup, setShowPopup] = useState(false);
    const surahs = Array.from({ length: 114 }, (_, i) => i + 1);
    const popupRef = useRef<HTMLUListElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setShowPopup(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const togglePopup = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        setShowPopup(!showPopup);
    }

    return (
        <div className='chapter-header'>
            <a href='#' onClick={togglePopup}>Surah {chapterNumber}</a>
            <ul className={`chapter-popup ${showPopup ? 'show-popup' : ''}`} ref={popupRef}>
                {surahs.map(surah => (
                    <li key={surah}>
                        <Link to={`/${surah}`} onClick={() => setShowPopup(false)}>Surah {surah}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}