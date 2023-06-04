import { useEffect, useMemo, useState, createRef, RefObject } from 'react';
import { SVGText } from './svg-text';
import { SVGArabicToken } from './svg-arabic-token';
import { Rect } from '../layout/geometry';
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

type Layout = {
    translationBoxes: Rect[],
    tokenBoxes: Rect[]
}

const layoutGraph = (svgDom: SVGDom): Layout => {
    const { translationRefs, tokenRefs } = svgDom;
    const translationBoxes: Rect[] = [];
    const tokenBoxes: Rect[] = [];

    let x = 0;
    for (const translationRef of translationRefs) {
        if (translationRef.current) {
            const { width, height } = translationRef.current.getBBox();
            const y = 0;
            translationBoxes.push({ x, y, width, height });
            x += width + 5;
        } else {
            translationBoxes.push({ x: 0, y: 0, width: 0, height: 0 });
        }
    }

    x = 600;
    for (const tokenRef of tokenRefs) {
        if (tokenRef.current) {
            const { width, height } = tokenRef.current.getBBox();
            const y = 100;
            x -= width;
            tokenBoxes.push({ x, y, width, height });
            x -= 5;
        }
    }

    return { translationBoxes, tokenBoxes };
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

    const [layout, setLayout] = useState<Layout>({
        translationBoxes: [],
        tokenBoxes: []
    });

    useEffect(() => {
        setLayout(layoutGraph(svgDom));
    }, [syntaxGraph]);

    const wordFontSize = theme.syntaxGraphHeaderFontSize;
    const wordFont = theme.fonts.defaultFont;
    const wordFontMetrics = fontService.getFontMetrics(wordFont);

    const tokenFontSize = theme.syntaxGraphArabicFontSize;
    const tokenFont = theme.fonts.defaultArabicFont;
    const tokenFontMetrics = fontService.getFontMetrics(tokenFont);

    const { words } = syntaxGraph;
    return (
        <svg className='syntax-graph-view2' width={600} height={300} viewBox='0 0 600 300'>
            {
                words.map((word, i) => (
                    word.token ?
                        <SVGText
                            key={`translation-${i}`}
                            ref={svgDom.translationRefs[i]}
                            text={word.token.translation}
                            font={wordFont}
                            fontSize={wordFontSize}
                            fontMetrics={wordFontMetrics}
                            box={layout.translationBoxes[i]} />
                        : null
                ))
            }
            {
                words.map((word, i) => (
                    word.token ?
                        <SVGArabicToken
                            key={`token-${i}`}
                            ref={svgDom.tokenRefs[i]}
                            segments={word.token ? word.token.segments : []}
                            font={tokenFont}
                            fontSize={tokenFontSize}
                            fontMetrics={tokenFontMetrics}
                            box={layout.tokenBoxes[i]}
                            fade={word.type === 'reference'} />
                        : <SVGText
                            key={`token-${i}`}
                            ref={svgDom.tokenRefs[i]}
                            text={word.hiddenText ?? '*'}
                            font={tokenFont}
                            fontSize={tokenFontSize}
                            fontMetrics={tokenFontMetrics}
                            box={layout.tokenBoxes[i]}
                            className='silver' />
                ))
            }
        </svg>
    )
}