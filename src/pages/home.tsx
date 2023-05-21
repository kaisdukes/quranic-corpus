import { WordByWordView } from '../wbw/word-by-word-view';

export const Home = () => {
    return (
        <div className='home'>
            <h1>Corpus 2.0: Word by Word Test</h1>
            <p>
                This design is currently at a basic stage, serving as a color test for word segments.
                Rest assured, this is not the final appearance, which will undergo significant enhancements.
            </p>
            <WordByWordView />
        </div>
    )
}