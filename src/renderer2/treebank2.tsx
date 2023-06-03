import { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { ContentPage } from '../content-page';
import { GraphLocation } from '../corpus/syntax/graph-location';
import { formatLocation } from '../corpus/orthography/location';
import { SyntaxService } from '../corpus/syntax/syntax-service';
import { SVGView } from './svg-view';
import { SyntaxGraph } from '../corpus/syntax/syntax-graph';
import { PrevNextNavigation } from '../navigation/prev-next-navigation';
import { container } from 'tsyringe';
import { AxiosError } from 'axios';
import { useOverlay } from '../overlay-context';
import './treebank2.scss';

export const Treebank2 = () => {
    const graphLocation = useLoaderData() as GraphLocation;
    const { location, graphNumber } = graphLocation;
    const [chapterNumber, verseNumber] = location;
    const { setOverlay } = useOverlay();
    const [syntaxGraph, setSyntaxGraph] = useState<SyntaxGraph | null>(null);
    const syntaxService = container.resolve(SyntaxService);
    const baseUrl = '/treebank2';

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
    }, [chapterNumber, verseNumber, graphNumber])

    const getGraphUrl = (graphLocation?: GraphLocation) => {
        if (!graphLocation) return undefined;
        const { location, graphNumber } = graphLocation;
        const url = `${baseUrl}/${formatLocation(location)}`;
        return graphNumber === 1 ? url : `${url}?graph=${graphNumber}`;
    }

    return (
        <ContentPage className='treebank2' navigation={{ chapterNumber, url: baseUrl }}>
            <h1>Corpus 2.0: Renderer Test</h1>
            <p>
                This desktop-optimized page tests a new vector renderer for Quranic Arabic Corpus 2.0.
                We're comparing the under-development vector-rendered image (first) with the existing
                bitmap-rendered image (second). The vector image may not fully replicate the dependency
                graph yet.
            </p>
            {
                syntaxGraph &&
                <>
                    <nav className='navigation'>
                        <div className='location'>
                            <div>Verse {verseNumber}</div>
                            {
                                syntaxGraph.graphCount > 1 &&
                                <div>Graph <strong>{graphNumber} / {syntaxGraph.graphCount}</strong></div>
                            }
                        </div>
                        <PrevNextNavigation
                            prevUrl={getGraphUrl(syntaxGraph.prev)}
                            nextUrl={getGraphUrl(syntaxGraph.next)} />
                    </nav>
                    <div className='compare'>
                        <SVGView syntaxGraph={syntaxGraph} />
                        {
                            syntaxGraph.legacyCorpusGraphNumber > 0 &&
                            <img src={`https://corpus.quran.com/graphimage?id=${syntaxGraph.legacyCorpusGraphNumber}`} />
                        }
                    </div>
                </>
            }
        </ContentPage>
    )
}