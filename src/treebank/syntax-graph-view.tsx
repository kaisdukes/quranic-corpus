import { useEffect, useMemo, useState, createRef, Fragment } from 'react';
import { SVGText } from './svg-text';
import { SVGDom } from '../layout/svg-dom';
import { SVGArabicToken } from './svg-arabic-token';
import { FontService } from '../typography/font-service';
import { ColorService } from '../theme/color-service';
import { SyntaxGraph } from '../corpus/syntax/syntax-graph';
import { GraphLayout } from '../layout/graph-layout';
import { SyntaxGraphVisualizer } from '../layout/syntax-graph-visualizer';
import { ArcArrow } from './arc-arrow';
import { formatLocation } from '../corpus/orthography/location';
import { theme } from '../theme/theme';
import { container } from 'tsyringe';
import './syntax-graph-view.scss';

type Props = {
    syntaxGraph: SyntaxGraph
}

const createTextRefs = (count: number) => {
    return Array.from({ length: count }, () => createRef<SVGTextElement>());
}

export const SyntaxGraphView = ({ syntaxGraph }: Props) => {
    const fontService = container.resolve(FontService);
    const colorService = container.resolve(ColorService);

    const svgDom: SVGDom = useMemo(() => {
        return {
            wordElements: syntaxGraph.words.map(word => {
                const brackets = syntaxGraph.brackets(word);
                return {
                    locationRef: createRef<SVGTextElement>(),
                    phoneticRef: createRef<SVGTextElement>(),
                    translationRef: createRef<SVGTextElement>(),
                    braRef: brackets ? createRef<SVGTextElement>() : undefined,
                    tokenRef: createRef<SVGTextElement>(),
                    ketRef: brackets ? createRef<SVGTextElement>() : undefined,
                    posTagRefs: createTextRefs(word.endNode - word.startNode + 1)
                }
            }),
            phraseTagRefs: createTextRefs(syntaxGraph.phraseNodes ? syntaxGraph.phraseNodes.length : 0),
            dependencyTagRefs: createTextRefs(syntaxGraph.edges ? syntaxGraph.edges.length : 0)
        };
    }, [syntaxGraph]);

    const [graphLayout, setGraphLayout] = useState<GraphLayout>({
        wordLayouts: [],
        phraseLayouts: [],
        edgeLabels: [],
        arcs: [],
        arrows: [],
        containerSize: {
            width: 0,
            height: 0
        }
    });

    const {
        wordLayouts,
        phraseLayouts,
        edgeLabels,
        arcs,
        arrows,
        containerSize
    } = graphLayout;

    useEffect(() => {
        (async () => {
            const syntaxGraphVisualizer = new SyntaxGraphVisualizer(syntaxGraph, svgDom);
            setGraphLayout(syntaxGraphVisualizer.layoutGraph());
        })();
    }, [syntaxGraph])

    // fonts
    const defaultFont = theme.fonts.defaultFont;
    const defaultArabicFont = theme.fonts.defaultArabicFont;
    const hiddenWordFont = theme.fonts.hiddenWordFont;

    // metrics
    const defaultFontMetrics = fontService.getFontMetrics(defaultFont);
    const defaultArabicFontMetrics = fontService.getFontMetrics(defaultArabicFont);
    const hiddenWordFontMetrics = fontService.getFontMetrics(hiddenWordFont);
    const {
        syntaxGraphHeaderFontSize,
        syntaxGraphTokenFontSize,
        syntaxGraphHiddenWordFontSize,
        syntaxGraphTagFontSize,
        syntaxGraphEdgeLabelFontSize
    } = theme;

    return (
        <svg
            className='syntax-graph-view'
            width={containerSize.width}
            height={containerSize.height}
            viewBox={`0 0 ${containerSize.width} ${containerSize.height}`}>
            {
                syntaxGraph.words.map((word, i) => {
                    const wordElement = svgDom.wordElements[i];
                    const fade = word.type === 'reference';
                    const wordLayout = wordLayouts[i];
                    const brackets = syntaxGraph.brackets(word);
                    return (
                        <Fragment key={`word-${i}`}>
                            {
                                word.token ? (
                                    <>
                                        <SVGText
                                            ref={wordElement.locationRef}
                                            text={formatLocation(word.token.location)}
                                            font={defaultFont}
                                            fontSize={syntaxGraphHeaderFontSize}
                                            fontMetrics={defaultFontMetrics}
                                            box={wordLayout && wordLayout.location}
                                            className={fade ? 'silver' : 'location'} />
                                        <SVGText
                                            ref={wordElement.phoneticRef}
                                            text={word.token.phonetic}
                                            font={defaultFont}
                                            fontSize={syntaxGraphHeaderFontSize}
                                            fontMetrics={defaultFontMetrics}
                                            box={wordLayout && wordLayout.phonetic}
                                            className={fade ? 'silver' : 'phonetic'} />
                                        <SVGText
                                            ref={wordElement.translationRef}
                                            text={word.token.translation}
                                            font={defaultFont}
                                            fontSize={syntaxGraphHeaderFontSize}
                                            fontMetrics={defaultFontMetrics}
                                            box={wordLayout && wordLayout.translation}
                                            className={fade ? 'silver' : undefined} />
                                        {
                                            brackets &&
                                            <SVGText
                                                ref={wordElement.braRef}
                                                text={'('}
                                                font={hiddenWordFont}
                                                fontSize={syntaxGraphHiddenWordFontSize}
                                                fontMetrics={hiddenWordFontMetrics}
                                                box={wordLayout && wordLayout.bra}
                                                className='silver' />
                                        }
                                        <SVGArabicToken
                                            ref={wordElement.tokenRef}
                                            token={word.token}
                                            font={defaultArabicFont}
                                            fontSize={syntaxGraphTokenFontSize}
                                            fontMetrics={defaultArabicFontMetrics}
                                            box={wordLayout && wordLayout.token}
                                            fade={fade} />
                                        {
                                            brackets &&
                                            <SVGText
                                                ref={wordElement.ketRef}
                                                text={')'}
                                                font={hiddenWordFont}
                                                fontSize={syntaxGraphHiddenWordFontSize}
                                                fontMetrics={hiddenWordFontMetrics}
                                                box={wordLayout && wordLayout.ket}
                                                className='silver' />
                                        }
                                        {
                                            (() => {
                                                const { segments } = word.token;
                                                const posTags = [];
                                                let j = 0;
                                                for (const segment of segments) {
                                                    if (segment.posTag !== 'DET') {
                                                        const nodeCircle = wordLayout && wordLayout.nodeCircles[j];
                                                        const className = fade ? 'silver' : colorService.getSegmentColor(segment);
                                                        posTags.push(
                                                            <Fragment key={`segment-${j}`}>
                                                                {
                                                                    nodeCircle &&
                                                                    <circle key={`circle-${i}`} {...nodeCircle} className={className} />
                                                                }
                                                                <SVGText
                                                                    ref={wordElement.posTagRefs[j]}
                                                                    text={segment.posTag}
                                                                    font={defaultFont}
                                                                    fontSize={syntaxGraphTagFontSize}
                                                                    fontMetrics={defaultFontMetrics}
                                                                    box={wordLayout?.posTags && wordLayout.posTags[j]}
                                                                    className={className} />
                                                            </Fragment>
                                                        );
                                                        j++;
                                                    }
                                                }
                                                return posTags;
                                            })()
                                        }
                                    </>
                                ) : (
                                    <>
                                        {
                                            word.hiddenText ?
                                                <>
                                                    {
                                                        brackets &&
                                                        <SVGText
                                                            ref={wordElement.braRef}
                                                            text={'('}
                                                            font={hiddenWordFont}
                                                            fontSize={syntaxGraphHiddenWordFontSize}
                                                            fontMetrics={hiddenWordFontMetrics}
                                                            box={wordLayout && wordLayout.bra}
                                                            className='silver' />
                                                    }
                                                    <SVGText
                                                        ref={wordElement.tokenRef}
                                                        text={word.hiddenText}
                                                        font={defaultArabicFont}
                                                        fontSize={syntaxGraphTokenFontSize}
                                                        fontMetrics={defaultArabicFontMetrics}
                                                        box={wordLayout && wordLayout.token}
                                                        className='silver' />
                                                    {
                                                        brackets &&
                                                        <SVGText
                                                            ref={wordElement.ketRef}
                                                            text={')'}
                                                            font={hiddenWordFont}
                                                            fontSize={syntaxGraphHiddenWordFontSize}
                                                            fontMetrics={hiddenWordFontMetrics}
                                                            box={wordLayout && wordLayout.ket}
                                                            className='silver' />
                                                    }
                                                </>
                                                : <SVGText
                                                    ref={wordElement.tokenRef}
                                                    text={'(*)'}
                                                    font={hiddenWordFont}
                                                    fontSize={syntaxGraphHiddenWordFontSize}
                                                    fontMetrics={hiddenWordFontMetrics}
                                                    box={wordLayout && wordLayout.token}
                                                    className='silver' />
                                        }
                                        <SVGText
                                            ref={wordElement.posTagRefs[0]}
                                            text={word.hiddenPosTag!}
                                            font={defaultFont}
                                            fontSize={syntaxGraphTagFontSize}
                                            fontMetrics={defaultFontMetrics}
                                            box={wordLayout && wordLayout.posTags[0]}
                                            className='silver' />
                                        {
                                            wordLayout && wordLayout.nodeCircles[0] &&
                                            <circle key={`circle-${i}`} {...wordLayout.nodeCircles[0]} className='silver' />
                                        }
                                    </>
                                )
                            }
                        </Fragment>
                    )
                })
            }
            {
                syntaxGraph.phraseNodes && syntaxGraph.phraseNodes.map((phraseNode, i) => {
                    const phraseLayout = phraseLayouts[i];
                    const className = colorService.getPhraseColor(phraseNode.phraseTag);
                    return (
                        <Fragment key={`pharse-${i}`}>
                            {
                                phraseLayout &&
                                <>
                                    <line {...phraseLayout.line} className='sky-light' />
                                    <circle {...phraseLayout.nodeCircle} className={className} />
                                </>
                            }
                            <SVGText
                                ref={svgDom.phraseTagRefs[i]}
                                text={phraseNode.phraseTag}
                                font={defaultFont}
                                fontSize={syntaxGraphTagFontSize}
                                fontMetrics={defaultFontMetrics}
                                box={phraseLayout && phraseLayout.phraseTag}
                                className={className} />
                        </Fragment>
                    )
                })
            }
            {
                syntaxGraph.edges && syntaxGraph.edges.map((edge, i) => {
                    const arc = arcs[i];
                    if (!arc) return null;
                    const className = `${colorService.getDependencyColor(edge.dependencyTag)}-light`;
                    return (
                        <Fragment key={`arc-${i}`}>
                            <path
                                d={`M ${arc.x1} ${arc.y1} A ${arc.rx} ${arc.ry} 0 0 0 ${arc.x2} ${arc.y2}`}
                                fill='none'
                                className={className} />
                            <ArcArrow arrow={arrows[i]} className={className} />
                        </Fragment>
                    )
                }).filter(Boolean)
            }
            {
                syntaxGraph.edges && syntaxGraph.edges.map((edge, i) => {
                    const edgeLabel = edgeLabels[i];
                    const className = `${colorService.getDependencyColor(edge.dependencyTag)}-light`;
                    return (
                        <Fragment key={`edge-${i}`}>
                            {
                                edgeLabel &&
                                <rect {...edgeLabel} className='edge-label' />
                            }
                            <SVGText
                                ref={svgDom.dependencyTagRefs[i]}
                                text={syntaxGraph.edgeLabels[i]}
                                font={defaultFont}
                                fontSize={syntaxGraphEdgeLabelFontSize}
                                fontMetrics={defaultFontMetrics}
                                rtl={true}
                                box={edgeLabel}
                                className={className} />
                        </Fragment>
                    )
                })
            }
        </svg>
    )
}