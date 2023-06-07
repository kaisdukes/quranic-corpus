import { useEffect, useState } from 'react';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import { ContentPage } from '../content-page';
import { GraphLocation } from '../corpus/syntax/graph-location';
import { formatLocation, parseLocation } from '../corpus/orthography/location';
import { SyntaxService } from '../corpus/syntax/syntax-service';
import { SyntaxGraph } from '../corpus/syntax/syntax-graph';
import { SyntaxGraphView } from '../treebank/syntax-graph-view';
import { CorpusError } from '../errors/corpus-error';
import { Footer } from '../components/footer';
import { SidePanel } from './side-panel';
import { PrevNextNavigation } from '../navigation/prev-next-navigation';
import { AxiosError } from 'axios';
import { useOverlay } from '../overlay-context';
import { container } from 'tsyringe';
import './workspace.scss';

export const Workspace = () => {
    const graphLocation = useLoaderData() as GraphLocation;
    const { location, graphNumber } = graphLocation;
    const [chapterNumber, verseNumber] = location;
    const { setOverlay } = useOverlay();
    const [leftSplitterPosition, setLeftSplitterPosition] = useState(300);
    const [rightSplitterPosition, setRightSplitterPosition] = useState(300);
    const [syntaxGraph, setSyntaxGraph] = useState<SyntaxGraph | null>(null);
    const syntaxService = container.resolve(SyntaxService);
    const baseUrl = '/mockup';

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
        <ContentPage className='workspace' navigation={{ chapterNumber, url: baseUrl }}>
            <SidePanel splitterPosition={leftSplitterPosition} onSplitterPositionChanged={setLeftSplitterPosition}>
                LEFT
            </SidePanel>
            <div className='dependency-graph'>
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
                        <SyntaxGraphView syntaxGraph={syntaxGraph} />
                    </>
                }
                <Footer />
            </div>
            <SidePanel right splitterPosition={rightSplitterPosition} onSplitterPositionChanged={setRightSplitterPosition}>
                RIGHT
            </SidePanel>
        </ContentPage>
    )
}