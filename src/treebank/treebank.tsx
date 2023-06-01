import { useEffect, useState } from 'react';
import { SyntaxService } from '../corpus/syntax/syntax-service';
import { SyntaxGraph } from '../corpus/syntax/syntax-graph';
import { SyntaxGraphView } from '../treebank/syntax-graph-view';
import { container } from 'tsyringe';
import './treebank.scss';

export const Treebank = () => {
    const [syntaxGraph, setSyntaxGraph] = useState<SyntaxGraph | null>(null);
    const location = [4, 79]; // [6, 12]
    const graphNumber = 3; // 1

    useEffect(() => {
        (async () => {
            const syntaxService = container.resolve(SyntaxService);
            setSyntaxGraph(await syntaxService.getSyntax(location, graphNumber));
        })();
    }, [])

    return (
        <div className='treebank'>
            <h1>Corpus 2.0: Renderer Test</h1>
            <p>
                This desktop-optimized page tests a new vector renderer for Quranic Arabic Corpus 2.0.
                We're comparing the under-development vector-rendered image (first) with the existing
                bitmap-rendered image (second). The vector image may not fully replicate the dependency
                graph yet.
            </p>
            {
                syntaxGraph
                    ? <div className='compare'>
                        <SyntaxGraphView syntaxGraph={syntaxGraph} />
                        <img src={`https://corpus.quran.com/graphimage?id=${syntaxGraph.legacyCorpusGraphNumber}`} />
                    </div>
                    : <div>Loading...</div>
            }
        </div>
    )
}