import { Link } from 'react-router-dom';
import { useState } from 'react';
import './chapter-header.scss';

type Props = {
    chapterNumber: number
}

export const ChapterHeader = ({ chapterNumber }: Props) => {
    const [showPopup, setShowPopup] = useState(false);
    const surahs = Array.from({ length: 114 }, (_, i) => i + 1);

    const togglePopup = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        setShowPopup(!showPopup);
    }

    return (
        <div className={`chapter-header ${showPopup ? 'show-popup' : ''}`}>
            <a href='#' onClick={togglePopup}>Surah {chapterNumber}</a>
            <ul className='chapter-popup'>
                {surahs.map(surah => (
                    <li key={surah}>
                        <Link to={`/${surah}`} onClick={() => setShowPopup(false)}>Surah {surah}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}