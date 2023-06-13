import { WordMorphology } from '../corpus/morphology/word-morphology';
import { CloseButton } from '../components/close-button';
import { useLocation } from 'react-router-dom';
import './word-morphology-view.scss';

type Props = {
    wordMorphology: WordMorphology
}

export const WordMorphologyView = ({ wordMorphology }: Props) => {
    const { pathname: url } = useLocation();
    return (
        <div className='word-morphology-view'>
            <div className='header'>
                <CloseButton url={url} />
            </div>
            TEST: {JSON.stringify(wordMorphology)}<br />
        </div>
    )
}