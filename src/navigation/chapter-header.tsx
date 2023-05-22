import './chapter-header.scss';

type Props = {
    chapterNumber: number
}

export const ChapterHeader = ({ chapterNumber }: Props) => {
    return (
        <div className='chapter-header'>
            <a href='#'>Surah {chapterNumber}</a>
        </div>
    )
}