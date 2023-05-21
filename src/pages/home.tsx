import { WordByWordView } from '../wbw/word-by-word-view';
import './home.scss';

export const Home = () => {
    return (
        <div className='home'>
            <h1>Corpus 2.0: Word by Word Test</h1>
            <p>
                This is a test page optimized for viewing on a desktop.
            </p>
            <WordByWordView />
        </div>
    )
}