import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../images/logo.svg';
import './home.scss';

export const Home = () => {
    return (
        <div className='home'>
            <h1>The Quranic Arabic Corpus</h1>
            <Logo className='logo' />
            <p className='intro'>
                Welcome to the Quranic Arabic Corpus, an annotated linguistic resource
                which shows the Arabic grammar, syntax and morphology for each word in the Holy Quran.
                The corpus provides three levels of analysis: morphological analysis,
                a syntactic treebank and a semantic ontology.
            </p>
            <p>
                <Link className='wbw' to='/1'>Word by Word</Link>
            </p>
        </div>
    )
}