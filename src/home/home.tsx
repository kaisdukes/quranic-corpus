import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../images/logo.svg';
import { Footer } from '../components/footer';
import slack from '../images/slack.svg';
import './home.scss';

const randomChapter = () => Math.floor(Math.random() * 114) + 1;

export const Home = () => {
    return (
        <div className='home'>
            <Link to={`/${randomChapter()}`}>
                <Logo className='logo' />
            </Link>
            <h1>The Quranic Arabic Corpus</h1>
            <p className='intro'>
                The world's most popular site for learning Quranic Arabic.
                An Artifical Intelligence (AI) analyzed the entire quran, <strong>reviewed and corrected by scholars</strong>, to provide
                deep insights into the Quran's <strong>morpology</strong>, <strong>syntax</strong>,
                and <strong>semantics</strong>.
            </p>
            <p style={{marginTop: 0}}>
                To help leaners, the corpus features unique color-coded grammar diagrams
                based on <strong><em>i’rāb</em> (إعراب)</strong>, the traditional science of Arabic linguistics, in the Quranic Treebank.
            </p>
            <p className='wbw'>
                <Link to={`/${randomChapter()}`}>Quran Word by Word</Link>
            </p>
            <p>
                The corpus provides a <strong>supportive community</strong> for learning Quranic Arabic.
                It is a free, open-source, Wikipedia-style project, and we encourage collobration, discusson and
                continuous improvement.
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