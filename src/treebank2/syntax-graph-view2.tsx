import { useEffect, useMemo, useState, createRef, RefObject } from 'react';
import { SVGText } from './svg-text';
import { SVGArabicToken } from './svg-arabic-token';
import { Rect, Size } from '../layout/geometry';
import { FontService } from '../typography/font-service';
import { SyntaxGraph } from '../corpus/syntax/syntax-graph';
import { theme } from '../theme/theme';
import { container } from 'tsyringe';
import './syntax-graph-view2.scss';

export type SegmentedWord = {
    segments: string[],
    classNames: string[]
}

type SVGDom = {
    translationRefs: RefObject<SVGTextElement>[],
    tokenRefs: RefObject<SVGTextElement>[]
};

type GraphLayout = {
    translationBoxes: Rect[],
    tokenBoxes: Rect[],
    containerSize: Size
}

const layoutGraph = (syntaxGraph: SyntaxGraph, svgDom: SVGDom): GraphLayout => {
    const { words } = syntaxGraph;
    const { translationRefs, tokenRefs } = svgDom;
    const translationBoxes: Rect[] = [];
    const tokenBoxes: Rect[] = [];
    const wordGap = 40;
    const tokenY = 30;

    // measure words
    const translationBounds = translationRefs.map(element => measureElement(element));
    const tokenBounds = tokenRefs.map(element => measureElement(element));
    const wordWidths = words.map((_, i) => Math.max(translationBounds[i].width, tokenBounds[i].width));
    const containerWidth = wordWidths.reduce((width, wordWidth) => width + wordWidth, 0) + wordGap * (words.length - 1);
    const containerHeight = tokenY + Math.max(...tokenBounds.map(size => size.height));

    // layout words
    let x = containerWidth;
    for (let i = 0; i < words.length; i++) {
        const translation = translationBounds[i];
        const token = tokenBounds[i];
        const width = wordWidths[i];
        x -= width;
        translationBoxes.push({ x: x + (width - translation.width) / 2, y: 0, width: translation.width, height: translation.height });
        tokenBoxes.push({ x: x + (width - token.width) / 2, y: tokenY, width: token.width, height: token.height });
        x -= wordGap;
    }

    return {
        translationBoxes,
        tokenBoxes,
        containerSize: {
            width: containerWidth,
            height: containerHeight
        }
    }
}

const measureElement = (element: RefObject<SVGGraphicsElement>): Size => {
    return element.current
        ? element.current.getBBox()
        : {
            width: 0,
            height: 0
        }
}

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
            translationRefs: createTextRefs(wordCount),
            tokenRefs: createTextRefs(wordCount)
        };
    }, [syntaxGraph]);

    const [graphLayout, setGraphLayout] = useState<GraphLayout>({
        translationBoxes: [],
        tokenBoxes: [],
        containerSize: {
            width: 0,
            height: 0
        }
    });

    const {
        translationBoxes,
        tokenBoxes,
        containerSize
    } = graphLayout;

    useEffect(() => {
        setGraphLayout(layoutGraph(syntaxGraph, svgDom));
    }, [syntaxGraph]);

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
                words.map((word, i) =>
                    word.token ?
                        <>
                            <SVGText
                                key={`translation-${i}`}
                                ref={svgDom.translationRefs[i]}
                                text={word.token.translation}
                                font={wordFont}
                                fontSize={wordFontSize}
                                fontMetrics={wordFontMetrics}
                                box={translationBoxes[i]} />
                            <SVGArabicToken
                                key={`token-${i}`}
                                ref={svgDom.tokenRefs[i]}
                                segments={word.token ? word.token.segments : []}
                                font={tokenFont}
                                fontSize={tokenFontSize}
                                fontMetrics={tokenFontMetrics}
                                box={tokenBoxes[i]}
                                fade={word.type === 'reference'} />
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
                )
            }
        </svg>
    )
}