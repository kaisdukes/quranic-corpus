import { Fragment, createRef, useEffect, useMemo, useState } from 'react';
import { GraphWord } from './graph-word';
import { PhraseElement } from './phrase-element';
import { EdgeLabel } from './edge-label';
import { GraphLayout } from '../layout/graph-layout';
import { SyntaxGraphVisualizer, WordElement } from '../layout/syntax-graph-visualizer';
import { ColorService } from '../theme/color-service';
import { SyntaxGraph } from '../corpus/syntax/syntax-graph';
import { container } from 'tsyringe';
import './syntax-graph-view.scss';

type Props = {
    syntaxGraph: SyntaxGraph
}

export const SyntaxGraphView = ({ syntaxGraph }: Props) => {
    const colorService = container.resolve(ColorService);
    const { words, edges, phraseNodes } = syntaxGraph;

    // This component uses a syntax graph visualizer for layout, which calculates positions of words,
    // phrase tags, and edge labels in the graph by measuring DOM elements. We memoize refs not for
    // performance, but to ensure consistency of these ref instances across component re-renders.

    const wordsRef = useMemo(() => syntaxGraph.words.map(word => {
        const posTagRefs = Array.from({ length: word.endNode - word.startNode + 1 }, () => createRef<HTMLDivElement>());
        const wordElement: WordElement = {
            ref: createRef<HTMLDivElement>(),
            posTagRefs
        };
        return wordElement;
    }), [syntaxGraph]);

    const phrasesRef = useMemo(() => (
        syntaxGraph.phraseNodes?.map(() => createRef<HTMLDivElement>()) || []
    ), [syntaxGraph]);

    const labelsRef = useMemo(() => (
        syntaxGraph.edges?.map(() => createRef<HTMLDivElement>()) || []
    ), [syntaxGraph]);

    const [graphLayout, setGraphLayout] = useState<GraphLayout>({
        wordPositions: [],
        nodePositions: [],
        phrasePositions: [],
        lines: [],
        arcs: [],
        arrowPositions: [],
        labelPositions: [],
        containerSize: {
            width: 0,
            height: 0
        }
    });

    const {
        wordPositions,
        nodePositions,
        phrasePositions,
        lines,
        arcs,
        arrowPositions,
        labelPositions,
        containerSize
    } = graphLayout;

    useEffect(() => {
        (async () => {
            const syntaxGraphVisualizer = new SyntaxGraphVisualizer(
                syntaxGraph,
                wordsRef,
                phrasesRef,
                labelsRef);
            setGraphLayout(syntaxGraphVisualizer.layoutSyntaxGraph());
        })();
    }, [syntaxGraph])

    return (
        <div
            className='syntax-graph-view'
            style={{ width: `${containerSize.width}px`, height: `${containerSize.height}px` }}>
            {
                words.map((word, i) => {
                    const wordElement = wordsRef[i];
                    return (
                        <GraphWord
                            key={`word-${i}`}
                            word={word}
                            ref={wordElement.ref}
                            posTagRefs={wordElement.posTagRefs}
                            position={wordPositions[i]} />
                    )
                })
            }
            {
                phraseNodes && phraseNodes.map((phraseNode, i) => {
                    const { phraseTag } = phraseNode;
                    return (
                        <PhraseElement
                            key={`phrase-${i}`}
                            ref={phrasesRef[i]}
                            className={colorService.getPhraseColor(phraseTag)}
                            tag={phraseTag}
                            position={phrasePositions[i]} />
                    )
                })
            }
            {
                edges && edges.map((edge, i) => {
                    return (
                        <EdgeLabel
                            key={`label-${i}`}
                            ref={labelsRef[i]}
                            dependencyTag={edge.dependencyTag}
                            position={labelPositions[i]} />
                    )
                })
            }
            <svg>
                {
                    lines.map((line, i) => <line key={`line-${i}`} {...line} className='sky-light' />)
                }
                {
                    arcs.map((arc, i) => {
                        const { x: x1, y: y1 } = nodePositions[arc.startNode];
                        const { x: x2, y: y2 } = nodePositions[arc.endNode];
                        const { x: ax, y: ay } = arrowPositions[i];
                        const className = `${colorService.getDependencyColor(arc.dependencyTag)}-light`;
                        return (
                            <Fragment key={`arc-${i}`}>
                                <path
                                    d={`M ${x1} ${y1} A ${arc.rx} ${arc.ry} ${arc.xAxisRotation} ${arc.largeArcFlag} ${arc.sweepFlag} ${x2} ${y2}`}
                                    fill='none'
                                    className={className} />
                                <polygon
                                    points={`${ax},${ay} ${ax},${ay + 10} ${ax + 6},${ay + 5}`}
                                    className={className} />
                            </Fragment>
                        )
                    })
                }
            </svg>
        </div>
    )
}