import { Fragment, RefObject, createRef, useEffect, useRef, useState } from 'react';
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

    const wordsRef = useRef<WordElement[]>(words.map(word => {
        const posTagRefs = Array.from({ length: word.endNode - word.startNode + 1 }, () => createRef<HTMLDivElement>());
        return {
            ref: createRef<HTMLDivElement>(),
            posTagRefs
        }
    }));

    const phrasesRef = useRef<RefObject<HTMLDivElement>[]>(
        phraseNodes.map(() => createRef<HTMLDivElement>())
    );

    const labelsRef = useRef<RefObject<HTMLDivElement>[]>(
        edges.map(() => createRef<HTMLDivElement>())
    );

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
            await document.fonts.load('1em Hafs');
            const syntaxGraphVisualizer = new SyntaxGraphVisualizer(
                syntaxGraph,
                wordsRef.current,
                phrasesRef.current,
                labelsRef.current);
            setGraphLayout(syntaxGraphVisualizer.layoutSyntaxGraph());
        })();
    }, [syntaxGraph])

    return (
        <div
            className='syntax-graph-view'
            style={{ width: `${containerSize.width}px`, height: `${containerSize.height}px` }}>
            {
                words.map((word, i) => {
                    const wordElement = wordsRef.current[i];
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
                phraseNodes.map((phraseNode, i) => {
                    const { phraseTag } = phraseNode;
                    return (
                        <PhraseElement
                            key={`phrase-${i}`}
                            ref={phrasesRef.current[i]}
                            className={colorService.getPhraseColor(phraseTag)}
                            tag={phraseTag}
                            position={phrasePositions[i]} />
                    )
                })
            }
            {
                edges.map((edge, i) => {
                    return (
                        <EdgeLabel
                            key={`label-${i}`}
                            ref={labelsRef.current[i]}
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