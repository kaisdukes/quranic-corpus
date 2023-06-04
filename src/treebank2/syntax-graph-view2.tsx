import { useEffect, useMemo, useState, createRef, Fragment } from 'react';
import { SVGText } from './svg-text';
import { SVGDom } from './svg-dom';
import { SVGArabicToken } from './svg-arabic-token';
import { FontService } from '../typography/font-service';
import { ColorService } from '../theme/color-service';
import { SyntaxGraph } from '../corpus/syntax/syntax-graph';
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
    const colorService = container.resolve(ColorService);

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
        arcs: [],
        containerSize: {
            width: 0,
            height: 0
        }
    });

    const {
        wordLayouts,
        arcs,
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

    // metrics
    const defaultFontMetrics = fontService.getFontMetrics(defaultFont);
    const defaultArabicFontMetrics = fontService.getFontMetrics(defaultArabicFont);
    const { syntaxGraphHeaderFontSize, syntaxGraphTokenFontSize, syntaxGraphPosTagFontSize } = theme;

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
                                                                    fontSize={syntaxGraphPosTagFontSize}
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
                                        <SVGText
                                            ref={svgDom.tokenRefs[i]}
                                            text={word.hiddenText ?? '*'}
                                            font={defaultArabicFont}
                                            fontSize={syntaxGraphTokenFontSize}
                                            fontMetrics={defaultArabicFontMetrics}
                                            box={wordLayout && wordLayout.token}
                                            className='silver' />
                                        <SVGText
                                            ref={svgDom.posTagRefs[word.startNode]}
                                            text={word.hiddenPosTag!}
                                            font={defaultFont}
                                            fontSize={syntaxGraphPosTagFontSize}
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
                arcs.map((arc, i) => {
                    return (
                        <path
                            key={`arc-${i}`}
                            d={`M ${arc.x1} ${arc.y1} A ${arc.rx} ${arc.ry} 0 0 0  ${arc.x2} ${arc.y2}`}
                            fill='none' />
                    )
                })
            }
        </svg>
    )
}