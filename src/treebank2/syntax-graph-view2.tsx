import { useEffect, useMemo, useState, createRef, Fragment } from 'react';
import { SVGText } from './svg-text';
import { SVGDom } from './svg-dom';
import { SVGArabicToken } from './svg-arabic-token';
import { FontService } from '../typography/font-service';
import { ColorService } from '../theme/color-service';
import { SyntaxGraph } from '../corpus/syntax/syntax-graph';
import { GraphLayout2 } from './graph-layout2';
import { SyntaxGraphVisualizer2 } from './syntax-graph-visualizer2';
import { ArcArrow } from './arc-arrow';
import { formatLocation } from '../corpus/orthography/location';
import { theme } from '../theme/theme';
import { container } from 'tsyringe';
import './syntax-graph-view2.scss';

type Props = {
    syntaxGraph: SyntaxGraph
}

const createTextRefs = (count: number) => {
    return Array.from({ length: count }, () => createRef<SVGTextElement>());
}

export const SyntaxGraphView2 = ({ syntaxGraph }: Props) => {
    const fontService = container.resolve(FontService);
    const colorService = container.resolve(ColorService);

    const svgDom: SVGDom = useMemo(() => {
        const wordCount = syntaxGraph.words.length;
        return {
            locationRefs: createTextRefs(wordCount),
            phoneticRefs: createTextRefs(wordCount),
            translationRefs: createTextRefs(wordCount),
            tokenRefs: createTextRefs(wordCount),
            posTagRefs: createTextRefs(syntaxGraph.segmentNodeCount),
            phraseTagRefs: createTextRefs(syntaxGraph.phraseNodes ? syntaxGraph.phraseNodes.length : 0),
            dependencyTagRefs: createTextRefs(syntaxGraph.edges ? syntaxGraph.edges.length : 0)
        };
    }, [syntaxGraph]);

    const [graphLayout, setGraphLayout] = useState<GraphLayout2>({
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
            const syntaxGraphVisualizer = new SyntaxGraphVisualizer2(syntaxGraph, svgDom);
            setGraphLayout(syntaxGraphVisualizer.layoutGraph());
        })();
    }, [syntaxGraph])

    // fonts
    const defaultFont = theme.fonts.defaultFont;
    const defaultArabicFont = theme.fonts.defaultArabicFont;
    const hiddenWordFont = theme.fonts.hiddenWordFont;
    const edgeLabelFont = theme.fonts.edgeLabelFont;

    // metrics
    const defaultFontMetrics = fontService.getFontMetrics(defaultFont);
    const defaultArabicFontMetrics = fontService.getFontMetrics(defaultArabicFont);
    const hiddenWordFontMetrics = fontService.getFontMetrics(hiddenWordFont);
    const edgeLabelFontMetrics = fontService.getFontMetrics(edgeLabelFont);
    const {
        syntaxGraphHeaderFontSize,
        syntaxGraphTokenFontSize,
        syntaxGraphHiddenWordFontSize,
        syntaxGraphTagFontSize,
        syntaxGraphEdgeLabelFontSize
    } = theme;

    return (
        <svg
            className='syntax-graph-view2'
            width={containerSize.width}
            height={containerSize.height}
            viewBox={`0 0 ${containerSize.width} ${containerSize.height}`}>
            {
                syntaxGraph.words.map((word, i) => {
                    const fade = word.type === 'reference';
                    const wordLayout = wordLayouts[i];
                    return (
                        <Fragment key={`word-${i}`}>
                            {
                                word.token ? (
                                    <>
                                        <SVGText
                                            ref={svgDom.locationRefs[i]}
                                            text={formatLocation(word.token.location)}
                                            font={defaultFont}
                                            fontSize={syntaxGraphHeaderFontSize}
                                            fontMetrics={defaultFontMetrics}
                                            box={wordLayout && wordLayout.location}
                                            className={fade ? 'silver' : 'location'} />
                                        <SVGText
                                            ref={svgDom.phoneticRefs[i]}
                                            text={word.token.phonetic}
                                            font={defaultFont}
                                            fontSize={syntaxGraphHeaderFontSize}
                                            fontMetrics={defaultFontMetrics}
                                            box={wordLayout && wordLayout.phonetic}
                                            className={fade ? 'silver' : 'phonetic'} />
                                        <SVGText
                                            ref={svgDom.translationRefs[i]}
                                            text={word.token.translation}
                                            font={defaultFont}
                                            fontSize={syntaxGraphHeaderFontSize}
                                            fontMetrics={defaultFontMetrics}
                                            box={wordLayout && wordLayout.translation}
                                            className={fade ? 'silver' : undefined} />
                                        <SVGArabicToken
                                            ref={svgDom.tokenRefs[i]}
                                            token={word.token}
                                            font={defaultArabicFont}
                                            fontSize={syntaxGraphTokenFontSize}
                                            fontMetrics={defaultArabicFontMetrics}
                                            box={wordLayout && wordLayout.token}
                                            fade={fade} />
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
                                                                    ref={svgDom.posTagRefs[word.startNode + j]}
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
                                                <SVGText
                                                    ref={svgDom.tokenRefs[i]}
                                                    text={word.hiddenText}
                                                    font={defaultArabicFont}
                                                    fontSize={syntaxGraphTokenFontSize}
                                                    fontMetrics={defaultArabicFontMetrics}
                                                    box={wordLayout && wordLayout.token}
                                                    className='silver' />
                                                : <SVGText
                                                    ref={svgDom.tokenRefs[i]}
                                                    text={'(*)'}
                                                    font={hiddenWordFont}
                                                    fontSize={syntaxGraphHiddenWordFontSize}
                                                    fontMetrics={hiddenWordFontMetrics}
                                                    box={wordLayout && wordLayout.token}
                                                    className='silver' />
                                        }
                                        <SVGText
                                            ref={svgDom.posTagRefs[word.startNode]}
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
                            {
                                wordLayout && wordLayout.bounds &&
                                <rect {...wordLayout.bounds} fill='none' stroke='red' />
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
                    const edgeLabel = edgeLabels[i];
                    const arc = arcs[i];
                    const className = `${colorService.getDependencyColor(edge.dependencyTag)}-light`;
                    return (
                        <Fragment key={`edge-${i}`}>
                            <SVGText
                                ref={svgDom.dependencyTagRefs[i]}
                                text={syntaxGraph.edgeLabels[i]}
                                font={edgeLabelFont}
                                fontSize={syntaxGraphEdgeLabelFontSize}
                                fontMetrics={edgeLabelFontMetrics}
                                box={edgeLabel}
                                singleLineHeight={true}
                                className={className} />
                            {
                                arc &&
                                <>
                                    <path
                                        d={`M ${arc.x1} ${arc.y1} A ${arc.rx} ${arc.ry} 0 0 0  ${arc.x2} ${arc.y2}`}
                                        fill='none'
                                        className={className} />
                                    <ArcArrow arrow={arrows[i]} className={className} />
                                </>
                            }
                        </Fragment>
                    )
                })
            }
        </svg>
    )
}