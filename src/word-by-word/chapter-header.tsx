import { Chapter } from '../corpus/orthography/chapter';
import makkah from '../images/makkah.svg';
import madinah from '../images/madinah.svg';
import './chapter-header.scss';

type Props = {
    chapter: Chapter
}

export const ChapterHeader = ({ chapter }: Props) => {
    const { phonetic, translation } = chapter;

    return (
        <header className='chapter-header'>
            <div className='grid'>
                <div className='city'>
                    <img src={chapter.city === 'Makkah' ? makkah : madinah} />
                </div>
                <div className='title'>
                    Sūrat {phonetic}
                    {
                        translation &&
                        <>
                            <span className='space'> </span>
                            <span className='translation'>({translation})</span>
                        </>
                    }
                </div>
            </div>
            <div className='page-title'>Word by Word</div>
        </header>
    )
}