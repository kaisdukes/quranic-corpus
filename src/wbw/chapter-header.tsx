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
        <div className='chapter-header'>
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
    )
}