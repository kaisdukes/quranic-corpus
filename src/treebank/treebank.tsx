import { SyntaxGraphView } from '../treebank/syntax-graph-view';
import './treebank.scss';

export const Treebank = () => {
    return (
        <div className='treebank'>
            <h1>Corpus 2.0: Renderer Test</h1>
            <p>
                This desktop-optimized page tests a new vector renderer for Quranic Arabic Corpus 2.0.
                We're comparing the under-development vector-rendered image (first) with the existing
                bitmap-rendered image (second). The vector image may not fully replicate the dependency
                graph yet.
            </p>
            <div className='compare'>
                <SyntaxGraphView />
                <img src='https://corpus.quran.com/graphimage?id=2553' />
            </div>
        </div>
    )
}