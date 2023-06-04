import { useEffect, useMemo, useState, createRef, Fragment } from 'react';
import { SVGText } from './svg-text';
import { SVGArabicToken } from './svg-arabic-token';
import { FontService } from '../typography/font-service';
import { SyntaxGraph } from '../corpus/syntax/syntax-graph';
import { SVGDom } from './svg-dom';
import { GraphLayout2 } from './graph-layout2';
import { SyntaxGraphVisualizer2 } from './syntax-graph-visualizer2';
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

    const svgDom: SVGDom = useMemo(() => {
        const wordCount = syntaxGraph.words.length;
        return {
            locationRefs: createTextRefs(wordCount),
            phoneticRefs: createTextRefs(wordCount),
            translationRefs: createTextRefs(wordCount),
            tokenRefs: createTextRefs(wordCount),
            posTagRefs: createTextRefs(syntaxGraph.segmentNodeCount)
        };
    }, [syntaxGraph]);

    const [graphLayout, setGraphLayout] = useState<GraphLayout2>({
        wordLayouts: [],
        containerSize: {
            width: 0,
            height: 0
        }
    });

    const {
        wordLayouts,
        containerSize
    } = graphLayout;

    useEffect(() => {
        (async () => {
            const syntaxGraphVisualizer = new SyntaxGraphVisualizer2(syntaxGraph, svgDom);
            setGraphLayout(syntaxGraphVisualizer.layoutGraph());
        })();
    }, [syntaxGraph])

    const wordFontSize = theme.syntaxGraphHeaderFontSize;
    const wordFont = theme.fonts.defaultFont;
    const wordFontMetrics = fontService.getFontMetrics(wordFont);

    const tokenFontSize = theme.syntaxGraphArabicFontSize;
    const tokenFont = theme.fonts.defaultArabicFont;
    const tokenFontMetrics = fontService.getFontMetrics(tokenFont);

    const { words } = syntaxGraph;
    return (
        <svg
            className='syntax-graph-view2'
            width={containerSize.width}
            height={containerSize.height}
            viewBox={`0 0 ${containerSize.width} ${containerSize.height}`}>
            {
                words.map((word, i) => {
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
                                            font={wordFont}
                                            fontSize={wordFontSize}
                                            fontMetrics={wordFontMetrics}
                                            box={wordLayout && wordLayout.location}
                                            className={fade ? 'silver' : undefined} />
                                        <SVGText
                                            ref={svgDom.phoneticRefs[i]}
                                            text={word.token.phonetic}
                                            font={wordFont}
                                            fontSize={wordFontSize}
                                            fontMetrics={wordFontMetrics}
                                            box={wordLayout && wordLayout.phonetic}
                                            className={fade ? 'silver' : 'phonetic'} />
                                        <SVGText
                                            ref={svgDom.translationRefs[i]}
                                            text={word.token.translation}
                                            font={wordFont}
                                            fontSize={wordFontSize}
                                            fontMetrics={wordFontMetrics}
                                            box={wordLayout && wordLayout.translation}
                                            className={fade ? 'silver' : undefined} />
                                        <SVGArabicToken
                                            ref={svgDom.tokenRefs[i]}
                                            token={word.token}
                                            font={tokenFont}
                                            fontSize={tokenFontSize}
                                            fontMetrics={tokenFontMetrics}
                                            box={wordLayout && wordLayout.token}
                                            fade={fade} />
                                        {
                                            word.token.segments.map((segment, j) => {
                                                const segmentIndex = word.startNode + j;
                                                const posTags = wordLayout?.posTags;
                                                return (
                                                    <SVGText
                                                        key={`segment-${i}-${j}`}
                                                        ref={svgDom.posTagRefs[segmentIndex]}
                                                        text={segment.posTag}
                                                        font={wordFont}
                                                        fontSize={wordFontSize}
                                                        fontMetrics={wordFontMetrics}
                                                        box={posTags && posTags[j]}
                                                        className={fade ? 'silver' : undefined} />
                                                )
                                            })
                                        }
                                    </>
                                ) : (
                                    <>
                                        <SVGText
                                            ref={svgDom.tokenRefs[i]}
                                            text={word.hiddenText ?? '*'}
                                            font={tokenFont}
                                            fontSize={tokenFontSize}
                                            fontMetrics={tokenFontMetrics}
                                            box={wordLayout && wordLayout.token}
                                            className='silver' />
                                        <SVGText
                                            ref={svgDom.posTagRefs[word.startNode]}
                                            text={word.hiddenPosTag!}
                                            font={wordFont}
                                            fontSize={wordFontSize}
                                            fontMetrics={wordFontMetrics}
                                            box={wordLayout && wordLayout.posTags[0]}
                                            className='silver' />
                                    </>
                                )
                            }
                            {
                                wordLayout &&
                                <rect
                                    x={wordLayout.bounds.x}
                                    y={wordLayout.bounds.y}
                                    width={wordLayout.bounds.width}
                                    height={wordLayout.bounds.height} />
                            }
                        </Fragment>
                    )
                })
            }
        </svg>
    )
}