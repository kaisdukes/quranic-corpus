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

type Layout = {
    textBoxes: Rect[],
    segmentedTextBoxes: Rect[]
}

const layoutGraph = (
    translationRefs: RefObject<SVGTextElement>[],
    tokensRef: RefObject<SVGTextElement>[]): Layout => {

    const textBoxes: Rect[] = [];
    const segmentedTextBoxes: Rect[] = [];
    let x = 0;

    for (const translationRef of translationRefs) {
        if (translationRef.current) {
            const { width, height } = translationRef.current.getBBox();
            const y = 0;
            textBoxes.push({ x, y, width, height });
            x += width + 5;
        } else {
            textBoxes.push({ x: 0, y: 0, width: 0, height: 0 });
        }
    }

    x = 600;
    for (const tokenRef of tokensRef) {
        if (tokenRef.current) {
            const { width, height } = tokenRef.current.getBBox();
            const y = 100;
            x -= width;
            segmentedTextBoxes.push({ x, y, width, height });
            x -= 5;
        }
    }

    return { textBoxes, segmentedTextBoxes };
}

type Props = {
    syntaxGraph: SyntaxGraph
}

export const SyntaxGraphView2 = ({ syntaxGraph }: Props) => {
    const fontService = container.resolve(FontService);
    const { words } = syntaxGraph;

    const translationsRef = useMemo(
        () => syntaxGraph.words.map(() => createRef<SVGTextElement>()),
        [syntaxGraph]
    );

    const tokensRef = useMemo(
        () => syntaxGraph.words.map(() => createRef<SVGTextElement>()),
        [syntaxGraph]
    );

    const [layout, setLayout] = useState<Layout>({
        textBoxes: [],
        segmentedTextBoxes: []
    });

    useEffect(() => {
        setLayout(layoutGraph(translationsRef, tokensRef));
    }, [syntaxGraph]);

    const wordFontSize = theme.syntaxGraphHeaderFontSize;
    const wordFont = theme.fonts.defaultFont;
    const wordFontMetrics = fontService.getFontMetrics(wordFont);

    const tokenFontSize = theme.syntaxGraphArabicFontSize;
    const tokenFont = theme.fonts.defaultArabicFont;
    const tokenFontMetrics = fontService.getFontMetrics(tokenFont);

    return (
        <svg className='syntax-graph-view2' width={600} height={300} viewBox='0 0 600 300'>
            {
                words.map((word, i) => (
                    word.token ?
                        <SVGText
                            key={`translation-${i}`}
                            ref={translationsRef[i]}
                            text={word.token.translation}
                            font={wordFont}
                            fontSize={wordFontSize}
                            fontMetrics={wordFontMetrics}
                            box={layout.textBoxes[i]} />
                        : null
                ))
            }
            {
                words.map((word, i) => (
                    word.token ?
                        <SVGArabicToken
                            key={`token-${i}`}
                            ref={tokensRef[i]}
                            segments={word.token ? word.token.segments : []}
                            font={tokenFont}
                            fontSize={tokenFontSize}
                            fontMetrics={tokenFontMetrics}
                            box={layout.segmentedTextBoxes[i]}
                            fade={word.type === 'reference'} />
                        : <SVGText
                            key={`token-${i}`}
                            ref={tokensRef[i]}
                            text={word.hiddenText ?? '*'}
                            font={tokenFont}
                            fontSize={tokenFontSize}
                            fontMetrics={tokenFontMetrics}
                            box={layout.segmentedTextBoxes[i]}
                            className='silver' />
                ))
            }
        </svg>
    )
}