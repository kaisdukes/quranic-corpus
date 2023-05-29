import { RefObject, createRef, useEffect, useRef, useState } from 'react';
import { GraphToken } from './graph-token';
import { NodeElement } from './node-element';
import { PhraseElement } from './phrase-element';
import { EdgeLabel } from './edge-label';
import { GraphLayout } from '../layout/graph-layout';
import { DependencyGraphService } from '../corpus/syntax/dependency-graph-service';
import { DependencyGraphVisualizer, TokenDomElement } from '../layout/dependency-graph-visualizer';
import { ColorService } from '../theme/color-service';
import { container } from 'tsyringe';
import './dependency-graph-view.scss';

export const DependencyGraphView = () => {
    const dependencyGraphService = container.resolve(DependencyGraphService);
    const colorService = container.resolve(ColorService);
    const dependencyGraph = dependencyGraphService.getDependencyGraph();
    const { words, edges, phraseNodes } = dependencyGraph;

    const tokensRef = useRef<TokenDomElement[]>(words.map(word => {
        const posTagRefs = Array.from({ length: word.nodeCount }, () => createRef<HTMLDivElement>());
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
        tokenPositions: [],
        phrasePositions: [],
        labelPositions: [],
        containerSize: {
            width: 0,
            height: 0
        }
    });

    const {
        tokenPositions,
        nodePositions,
        phrasePositions,
        arcs,
        labelPositions,
        containerSize
    } = graphLayout;

    useEffect(() => {
        (async () => {
            await document.fonts.load('1em Hafs');
            const dependencyGraphVisualizer = new DependencyGraphVisualizer(
                dependencyGraph,
                tokensRef.current,
                phrasesRef.current,
                labelsRef.current);
            setGraphLayout(dependencyGraphVisualizer.layoutDependencyGraph());
        })();
    }, [])

    return (
        <div
            className='dependency-graph-view'
            style={{ width: `${containerSize.width}px`, height: `${containerSize.height}px` }}>
            {
                words.map((word, i) => {
                    const tokenDomElement = tokensRef.current[i];
                    return (
                        <GraphToken
                            key={`token-${i}`}
                            token={word.token}
                            ref={tokenDomElement.ref}
                            posTagRefs={tokenDomElement.posTagRefs}
                            position={tokenPositions[i]} />
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
                    arcs && nodePositions &&
                    arcs.map((arc, i) => {
                        const { x: x1, y: y1 } = nodePositions[arc.startNode];
                        const { x: x2, y: y2 } = nodePositions[arc.endNode];
                        return (
                            <path
                                key={`arc-${i}`}
                                d={`M ${x1} ${y1} A ${arc.rx} ${arc.ry} ${arc.xAxisRotation} ${arc.largeArcFlag} ${arc.sweepFlag} ${x2} ${y2}`}
                                fill='none'
                                className={`${colorService.getDependencyColor(arc.dependencyTag)}-light`}
                            />
                        )
                    })
                }
            </svg>
        </div>
    )
}