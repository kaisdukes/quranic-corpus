import { RefObject, createRef, useEffect, useRef, useState } from 'react';
import { GraphToken } from './graph-token';
import { DependencyGraphService } from '../corpus/syntax/dependency-graph-service';
import { DependencyGraphVisualizer, TokenDomElement } from '../layout/dependency-graph-visualizer';
import { EdgeLabel } from './edge-label';
import { GraphLayout } from '../layout/graph-layout';
import { ColorService } from '../theme/color-service';
import { container } from 'tsyringe';
import './dependency-graph-view.scss';

export const DependencyGraphView = () => {
    const dependencyGraphService = container.resolve(DependencyGraphService);
    const colorService = container.resolve(ColorService);
    const dependencyGraph = dependencyGraphService.getDependencyGraph();
    const words = dependencyGraph.words;

    const tokensRef = useRef<TokenDomElement[]>(words.map(word => {
        const segmentCircleRefs = Array.from({ length: word.nodeCount }, () => createRef<HTMLDivElement>());
        return {
            ref: createRef<HTMLDivElement>(),
            segmentCircleRefs
        }
    }));

    const labelsRef = useRef<RefObject<HTMLDivElement>[]>(
        dependencyGraph.edges.map(() => createRef<HTMLDivElement>())
    );

    const [graphLayout, setGraphLayout] = useState<GraphLayout>({
        tokenPositions: [],
        labelPositions: [],
        containerSize: {
            width: 0,
            height: 0
        }
    });

    const {
        tokenPositions,
        nodePositions,
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
                            segmentCircleRefs={tokenDomElement.segmentCircleRefs}
                            position={tokenPositions[i]} />
                    )
                })
            }
            {
                dependencyGraph.edges.map((edge, i) => {
                    return (
                        <EdgeLabel
                            key={`label-${i}`}
                            ref={labelsRef.current[i]}
                            edge={edge}
                            position={labelPositions[i]} />
                    )
                })
            }
            <svg>
                {
                    nodePositions &&
                    dependencyGraph.phraseNodes.map((_, i) => {
                        const node = dependencyGraph.segmentNodeCount + i;
                        const { x, y } = nodePositions[node];
                        return (
                            <circle
                                key={`node-${node}`}
                                className='rust'
                                cx={x}
                                cy={y}
                                r={3} />
                        )
                    })
                }
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