import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../images/logo.svg';
import slack from '../images/slack.svg';
import './home.scss';

export const Home = () => {
    const randomChapter = Math.floor(Math.random() * 114) + 1;

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
            <p className='wbw'>
                <Link to={`/${randomChapter}`}>Quran Word by Word</Link>
            </p>
            <div className='footer'>
                <div className='slack'>
                    <a href='https://join.slack.com/t/quraniccorpus/shared_invite/zt-1vrmewq5c-TfFf~I7W5e6v3VYDeJsyvw'>
                        <img src={slack} />
                    </a>
                </div>
                <div>Copyright &copy; <a href='https://www.linkedin.com/in/kaisdukes'>Kais Dukes</a>, 2009-2023</div>
                <div><a href='https://eps.leeds.ac.uk/computing-applied-computing/staff/33/professor-eric-atwell'>Artificial Intelligence for Language</a></div>
                <div><a href='https://eps.leeds.ac.uk/computing'>University of Leeds</a></div>
            </div>
        </div>
    )
}