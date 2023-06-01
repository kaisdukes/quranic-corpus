import { useEffect, useState } from 'react';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import { ContentPage } from '../content-page';
import { GraphLocation } from '../corpus/syntax/graph-location';
import { parseLocation } from '../corpus/orthography/location';
import { SyntaxService } from '../corpus/syntax/syntax-service';
import { SyntaxGraph } from '../corpus/syntax/syntax-graph';
import { SyntaxGraphView } from '../treebank/syntax-graph-view';
import { CorpusError } from '../errors/corpus-error';
import { container } from 'tsyringe';
import { PrevNextNavigation } from '../navigation/prev-next-navigation';
import { AxiosError } from 'axios';
import { useOverlay } from '../overlay-context';
import './treebank.scss';

export const treebankLoader = ({ params, request }: LoaderFunctionArgs): GraphLocation => {
    const location = parseLocation(params.location!);
    const graphParam = new URL(request.url).searchParams.get('graph');
    const graphNumber = graphParam ? Number(graphParam) : 1;

    if (isNaN(location[0]) || isNaN(graphNumber)) {
        throw new CorpusError('404', 'Page not found');
    }
    return {
        location: location.length === 1 ? [location[0], 1] : location,
        graphNumber
    }
}

export const Treebank = () => {
    const graphLocation = useLoaderData() as GraphLocation;
    const { location } = graphLocation;
    const [chapterNumber, verseNumber] = location;
    const { setOverlay } = useOverlay();
    const [syntaxGraph, setSyntaxGraph] = useState<SyntaxGraph | null>(null);
    const syntaxService = container.resolve(SyntaxService);

    useEffect(() => {
        (async () => {
            setOverlay(true);
            try {
                setSyntaxGraph(await syntaxService.getSyntax(graphLocation));
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

    const handleNavigation = (next: boolean) => {
        console.log(`navigation: next = ${next}`);
    }

    return (
        <ContentPage className='treebank' navigation={{ chapterNumber, url: '/treebank' }}>
            <h1>Corpus 2.0: Renderer Test</h1>
            <p>
                This desktop-optimized page tests a new vector renderer for Quranic Arabic Corpus 2.0.
                We're comparing the under-development vector-rendered image (first) with the existing
                bitmap-rendered image (second). The vector image may not fully replicate the dependency
                graph yet.
            </p>
            <nav className='navigation'>
                <div className='location'>
                    <div>Verse {verseNumber}</div>
                    {
                        syntaxGraph && syntaxGraph.graphCount > 1 &&
                        <div>Graph <strong>{syntaxGraph.graphNumber} / {syntaxGraph.graphCount}</strong></div>
                    }
                </div>
                <PrevNextNavigation
                    prevEnabled={chapterNumber > 1 || verseNumber > 1}
                    nextEnabled={chapterNumber < 114 || verseNumber < 6}
                    onClick={handleNavigation} />
            </nav>
            {
                syntaxGraph &&
                <div className='compare'>
                    <SyntaxGraphView syntaxGraph={syntaxGraph} />
                    {
                        syntaxGraph.legacyCorpusGraphNumber > 0 &&
                        <img src={`https://corpus.quran.com/graphimage?id=${syntaxGraph.legacyCorpusGraphNumber}`} />
                    }
                </div>
            }
        </ContentPage>
    )
}