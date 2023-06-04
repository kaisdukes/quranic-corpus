import { useEffect, useMemo, useState, createRef, RefObject } from 'react';
import { SVGText } from './svg-text';
import { SVGArabicToken } from './svg-arabic-token';
import { Rect, Size } from '../layout/geometry';
import { FontService } from '../typography/font-service';
import { SyntaxGraph } from '../corpus/syntax/syntax-graph';
import { formatLocation } from '../corpus/orthography/location';
import { theme } from '../theme/theme';
import { container } from 'tsyringe';
import './syntax-graph-view2.scss';

export type SegmentedWord = {
    segments: string[],
    classNames: string[]
}

type SVGDom = {
    locationRefs: RefObject<SVGTextElement>[],
    phoneticRefs: RefObject<SVGTextElement>[],
    translationRefs: RefObject<SVGTextElement>[],
    tokenRefs: RefObject<SVGTextElement>[]
};

type GraphLayout = {
    locationBoxes: Rect[],
    phoneticBoxes: Rect[],
    translationBoxes: Rect[],
    tokenBoxes: Rect[],
    containerSize: Size
}

const layoutGraph = (syntaxGraph: SyntaxGraph, svgDom: SVGDom): GraphLayout => {
    const { words } = syntaxGraph;
    const { locationRefs, phoneticRefs, translationRefs, tokenRefs } = svgDom;
    const locationBoxes: Rect[] = [];
    const phoneticBoxes: Rect[] = [];
    const translationBoxes: Rect[] = [];
    const tokenBoxes: Rect[] = [];
    const wordGap = 40;
    const headerTextDeltaY = 25;

    // measure words
    const locationBounds = locationRefs.map(element => measureElement(element));
    const phoneticBounds = phoneticRefs.map(element => measureElement(element));
    const translationBounds = translationRefs.map(element => measureElement(element));
    const tokenBounds = tokenRefs.map(element => measureElement(element));
    const wordWidths = words.map((_, i) => Math.max(
        locationBounds[i].width,
        phoneticBounds[i].width,
        translationBounds[i].width,
        tokenBounds[i].width));
    const containerWidth = wordWidths.reduce((width, wordWidth) => width + wordWidth, 0) + wordGap * (words.length - 1);
    const containerHeight = headerTextDeltaY * 3 + Math.max(...tokenBounds.map(size => size.height));

    // layout words
    let x = containerWidth;
    for (let i = 0; i < words.length; i++) {
        const width = wordWidths[i];
        x -= width;
        let y = 0;
        locationBoxes.push(centerHorizontal(x, y, width, locationBounds[i]));
        y += headerTextDeltaY;
        phoneticBoxes.push(centerHorizontal(x, y, width, phoneticBounds[i]));
        y += headerTextDeltaY;
        translationBoxes.push(centerHorizontal(x, y, width, translationBounds[i]));
        y += headerTextDeltaY;
        tokenBoxes.push(centerHorizontal(x, y, width, tokenBounds[i]));
        x -= wordGap;
    }

    return {
        locationBoxes,
        phoneticBoxes,
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

const centerHorizontal = (x: number, y: number, width: number, element: Size): Rect => {
    return {
        x: x + (width - element.width) / 2,
        y, width: element.width, height: element.height
    };
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
            locationRefs: createTextRefs(wordCount),
            phoneticRefs: createTextRefs(wordCount),
            translationRefs: createTextRefs(wordCount),
            tokenRefs: createTextRefs(wordCount)
        };
    }, [syntaxGraph]);

    const [graphLayout, setGraphLayout] = useState<GraphLayout>({
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
                                key={`location-${i}`}
                                ref={svgDom.locationRefs[i]}
                                text={formatLocation(word.token.location)}
                                font={wordFont}
                                fontSize={wordFontSize}
                                fontMetrics={wordFontMetrics}
                                box={locationBoxes[i]} />
                            <SVGText
                                key={`phonetic-${i}`}
                                ref={svgDom.phoneticRefs[i]}
                                text={word.token.phonetic}
                                font={wordFont}
                                fontSize={wordFontSize}
                                fontMetrics={wordFontMetrics}
                                box={phoneticBoxes[i]} />
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