import { useEffect, useMemo, useState, createRef, RefObject } from 'react';
import { SVGText } from './svg-text';
import { SVGSegmentedText } from './svg-segmented-text';
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
    wordRefs: RefObject<SVGTextElement>[],
    segmentedWordRefs: RefObject<SVGTextElement>[]): Layout => {

    const textBoxes: Rect[] = [];
    const segmentedTextBoxes: Rect[] = [];
    let x = 0;

    for (const wordRef of wordRefs) {
        if (wordRef.current) {
            const { width, height } = wordRef.current.getBBox();
            const y = 0;
            textBoxes.push({ x, y, width, height });
            x += width + 5;
        }
    }

    x = 600;
    for (const segmentedWordRef of segmentedWordRefs) {
        if (segmentedWordRef.current) {
            const { width, height } = segmentedWordRef.current.getBBox();
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

    const wordsRef = useMemo(
        () => syntaxGraph.words.map(() => createRef<SVGTextElement>()),
        [syntaxGraph]
    );

    const segmentedWordsRef = useMemo(
        () => syntaxGraph.words.map(() => createRef<SVGTextElement>()),
        [syntaxGraph]
    );

    const [layout, setLayout] = useState<Layout>({
        textBoxes: [],
        segmentedTextBoxes: []
    });

    useEffect(() => {
        setLayout(layoutGraph(wordsRef, segmentedWordsRef));
    }, [syntaxGraph]);

    const wordFontSize = theme.syntaxGraphHeaderFontSize;
    const wordFont = theme.fonts.defaultFont;
    const wordFontMetrics = fontService.getFontMetrics(wordFont);

    const segmentedWordFontSize = theme.syntaxGraphArabicFontSize;
    const segmentedWordFont = theme.fonts.defaultArabicFont;
    const segmentedWordFontMetrics = fontService.getFontMetrics(segmentedWordFont);

    return (
        <svg className='syntax-graph-view2' width={600} height={300} viewBox='0 0 600 300'>
            {
                words.map((word, i) => (
                    <SVGText
                        key={`word-${i}`}
                        ref={wordsRef[i]}
                        text={word.token ? word.token.translation : 'NO_TOKEN'}
                        font={wordFont}
                        fontSize={wordFontSize}
                        fontMetrics={wordFontMetrics}
                        box={layout.textBoxes[i]} />
                ))
            }
            {
                words.map((word, i) => (
                    <SVGSegmentedText
                        key={`segmented-word-${i}`}
                        ref={segmentedWordsRef[i]}
                        segments={word.token ? word.token.segments : []}
                        font={segmentedWordFont}
                        fontSize={segmentedWordFontSize}
                        fontMetrics={segmentedWordFontMetrics}
                        box={layout.segmentedTextBoxes[i]} />
                ))
            }
        </svg>
    )
}