import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../images/logo.svg';
import { Footer } from '../components/footer';
import slack from '../images/slack.svg';
import './home.scss';

export const Home = () => {
    const randomChapter = Math.floor(Math.random() * 114) + 1;

    return (
        <div className='home'>
            <h1>The Quranic Arabic Corpus</h1>
            <Logo className='logo' />
            <p className='intro'>
                The Quranic Arabic Corpus is a valuable resource that provides detailed linguistic
                insights for every word in the Quran. It includes three types of analysis: morphology
                (the structure of words), syntax (the grammar of sentences), and semantics (meaning).
            </p>
            <p className='wbw'>
                <Link to={`/${randomChapter}`}>Quran Word by Word</Link>
            </p>
            <div className='slack'>
                <a href='https://join.slack.com/t/quraniccorpus/shared_invite/zt-1vrmewq5c-TfFf~I7W5e6v3VYDeJsyvw'>
                    <img src={slack} />
                </a>
            </div>
            <Footer />
        </div>
    )
}