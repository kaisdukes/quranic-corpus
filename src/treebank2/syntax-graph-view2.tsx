import { useEffect, useMemo, useState, createRef } from 'react';
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
            tokenRefs: createTextRefs(wordCount)
        };
    }, [syntaxGraph]);

    const [graphLayout, setGraphLayout] = useState<GraphLayout2>({
        locationBoxes: [],
        phoneticBoxes: [],
        translationBoxes: [],
        tokenBoxes: [],
        containerSize: {
            width: 0,
            height: 0
        }
    });

    const {
        locationBoxes,
        phoneticBoxes,
        translationBoxes,
        tokenBoxes,
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
                    return word.token ?
                        <>
                            <SVGText
                                key={`location-${i}`}
                                ref={svgDom.locationRefs[i]}
                                text={formatLocation(word.token.location)}
                                font={wordFont}
                                fontSize={wordFontSize}
                                fontMetrics={wordFontMetrics}
                                box={locationBoxes[i]}
                                className={fade ? 'silver' : undefined} />
                            <SVGText
                                key={`phonetic-${i}`}
                                ref={svgDom.phoneticRefs[i]}
                                text={word.token.phonetic}
                                font={wordFont}
                                fontSize={wordFontSize}
                                fontMetrics={wordFontMetrics}
                                box={phoneticBoxes[i]}
                                className={fade ? 'silver' : 'phonetic'} />
                            <SVGText
                                key={`translation-${i}`}
                                ref={svgDom.translationRefs[i]}
                                text={word.token.translation}
                                font={wordFont}
                                fontSize={wordFontSize}
                                fontMetrics={wordFontMetrics}
                                box={translationBoxes[i]}
                                className={fade ? 'silver' : undefined} />
                            <SVGArabicToken
                                key={`token-${i}`}
                                ref={svgDom.tokenRefs[i]}
                                token={word.token}
                                font={tokenFont}
                                fontSize={tokenFontSize}
                                fontMetrics={tokenFontMetrics}
                                box={tokenBoxes[i]}
                                fade={fade} />
                        </>
                        : <SVGText
                            key={`token-${i}`}
                            ref={svgDom.tokenRefs[i]}
                            text={word.hiddenText ?? '*'}
                            font={tokenFont}
                            fontSize={tokenFontSize}
                            fontMetrics={tokenFontMetrics}
                            box={tokenBoxes[i]}
                            className='silver' />
                })
            }
        </svg>
    )
}