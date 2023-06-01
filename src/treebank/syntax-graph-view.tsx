import { Fragment, RefObject, createRef, useEffect, useRef, useState } from 'react';
import { GraphToken } from './graph-token';
import { PhraseElement } from './phrase-element';
import { EdgeLabel } from './edge-label';
import { GraphLayout } from '../layout/graph-layout';
import { SyntaxService } from '../corpus/syntax/syntax-service';
import { SyntaxGraphVisualizer, TokenDomElement } from '../layout/syntax-graph-visualizer';
import { ColorService } from '../theme/color-service';
import { container } from 'tsyringe';
import './syntax-graph-view.scss';

export const SyntaxGraphView = () => {
    const syntaxService = container.resolve(SyntaxService);
    const colorService = container.resolve(ColorService);
    const syntaxGraph = syntaxService.getSyntax();
    const { words, edges, phraseNodes } = syntaxGraph;

    const tokensRef = useRef<TokenDomElement[]>(words.map(word => {
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
        tokenPositions: [],
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
        tokenPositions,
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
                tokensRef.current,
                phrasesRef.current,
                labelsRef.current);
            setGraphLayout(syntaxGraphVisualizer.layoutSyntaxGraph());
        })();
    }, [])

    return (
        <div
            className='syntax-graph-view'
            style={{ width: `${containerSize.width}px`, height: `${containerSize.height}px` }}>
            {
                words.map((word, i) => {
                    const tokenDomElement = tokensRef.current[i];
                    return (
                        <GraphToken
                            key={`token-${i}`}
                            token={word.token!}
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