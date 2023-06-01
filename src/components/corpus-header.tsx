import { Link } from 'react-router-dom';
import './corpus-header.scss';

export const CorpusHeader = () => {
    return (
        <header className='corpus-header'>
            Welcome to the <Link to='/'>Quranic Arabic Corpus</Link>, an annotated linguistic
            resource which shows the Arabic grammar, syntax and morphology for each word in the
            Quran. Click on an Arabic word below to see details of the word's grammar, or to suggest
            a correction.
        </header>
    )
}