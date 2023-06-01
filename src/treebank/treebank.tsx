import { useEffect, useState } from 'react';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import { ContentPage } from '../content-page';
import { Location, parseLocation } from '../corpus/orthography/location';
import { SyntaxService } from '../corpus/syntax/syntax-service';
import { SyntaxGraph } from '../corpus/syntax/syntax-graph';
import { SyntaxGraphView } from '../treebank/syntax-graph-view';
import { CorpusError } from '../errors/corpus-error';
import { container } from 'tsyringe';
import './treebank.scss';
import { useOverlay } from '../overlay-context';
import { AxiosError } from 'axios';

export const treebankLoader = ({ params }: LoaderFunctionArgs) => {
    const location = parseLocation(params.location!);
    if (isNaN(location[0])) {
        throw new CorpusError('404', 'Page not found');
    }
    return location.length === 1 ? [location[0], 1] : location;
}

export const Treebank = () => {
    const location = useLoaderData() as Location;
    const [chapterNumber, verseNumber] = location;

    const { setOverlay } = useOverlay();
    const [syntaxGraph, setSyntaxGraph] = useState<SyntaxGraph | null>(null);
    const graphNumber = 1;

    useEffect(() => {
        (async () => {
            setOverlay(true);
            try {
                const syntaxService = container.resolve(SyntaxService);
                setSyntaxGraph(await syntaxService.getSyntax(location, graphNumber));
            } catch (e) {
                if (e instanceof AxiosError && e.response?.status === 404) {
                    setSyntaxGraph(null);
                } else {
                    throw e;
                }
            }
            setOverlay(false);
        })();
    }, [chapterNumber, verseNumber])

    return (
        <ContentPage className='treebank' navigation={{ chapterNumber, url: '/treebank' }}>
            <h1>Corpus 2.0: Renderer Test</h1>
            <p>
                This desktop-optimized page tests a new vector renderer for Quranic Arabic Corpus 2.0.
                We're comparing the under-development vector-rendered image (first) with the existing
                bitmap-rendered image (second). The vector image may not fully replicate the dependency
                graph yet.
            </p>
            {
                syntaxGraph &&
                <div className='compare'>
                    <SyntaxGraphView syntaxGraph={syntaxGraph} />
                    <img src={`https://corpus.quran.com/graphimage?id=${syntaxGraph.legacyCorpusGraphNumber}`} />
                </div>
            }
        </ContentPage>
    )
}