import { arabicNumber } from '../arabic/arabic-number'
import './end-of-verse.scss';

type Props = {
    verseNumber: number
}

export const EndOfVerse = ({ verseNumber }: Props) => {
    return (
        <div className='end-of-verse brown'>
            {arabicNumber(verseNumber)}
        </div>
    )
}