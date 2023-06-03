import { useEffect, useState } from 'react';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import { ContentPage } from '../content-page';
import { GraphLocation } from '../corpus/syntax/graph-location';
import { formatLocation, parseLocation } from '../corpus/orthography/location';
import { ArabicTextService } from '../arabic/arabic-text-service';
import { SyntaxService } from '../corpus/syntax/syntax-service';
import { SVGView, SegmentedWord } from './svg-view';
import { SyntaxGraph } from '../corpus/syntax/syntax-graph';
import { SyntaxGraphView } from '../treebank/syntax-graph-view';
import { CorpusError } from '../errors/corpus-error';
import { PrevNextNavigation } from '../navigation/prev-next-navigation';
import { container } from 'tsyringe';
import { AxiosError } from 'axios';
import { useOverlay } from '../overlay-context';
import './svg-test.scss';

export const SVGTest = () => {
    const graphLocation = useLoaderData() as GraphLocation;
    const { location, graphNumber } = graphLocation;
    const [chapterNumber, verseNumber] = location;
    const { setOverlay } = useOverlay();
    const [syntaxGraph, setSyntaxGraph] = useState<SyntaxGraph | null>(null);
    const syntaxService = container.resolve(SyntaxService);
    const baseUrl = '/svg-test';

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
        <ContentPage className='svg-test' navigation={{ chapterNumber, url: baseUrl }}>
            <h1>Corpus 2.0: SVG Test</h1>
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
                    <SVGView syntaxGraph={syntaxGraph} />
                </>
            }
        </ContentPage>
    )
}