import { useEffect, useMemo, useState, createRef, RefObject } from 'react';
import { SVGText } from './svg-text';
import { SVGSegmentedText } from './svg-segmented-text';
import { Rect } from '../layout/geometry';
import { FontService } from '../typography/font-service';
import { container } from 'tsyringe';
import './svg-view.scss';

export type SegmentedWord = {
    segments: string[],
    classNames: string[]
}

type Layout = {
    textBoxes: Rect[],
    segmentedTextBoxes: Rect[]
}

const layoutWords = (
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

    x = 0;
    for (const segmentedWordRef of segmentedWordRefs) {
        if (segmentedWordRef.current) {
            const { width, height } = segmentedWordRef.current.getBBox();
            const y = 100;
            segmentedTextBoxes.push({ x, y, width, height });
            x += width + 5;
        }
    }

    return { textBoxes, segmentedTextBoxes };
}

type Props = {
    words: string[],
    segmentedWords: SegmentedWord[]
}

export const SVGView = ({ words, segmentedWords }: Props) => {
    const fontService = container.resolve(FontService);

    const [layout, setLayout] = useState<Layout>({
        textBoxes: [],
        segmentedTextBoxes: []
    });

    const wordsRef = useMemo(
        () => words.map(() => createRef<SVGTextElement>()),
        [words]
    );

    const segmentedWordsRef = useMemo(
        () => segmentedWords.map(() => createRef<SVGTextElement>()),
        [segmentedWords]
    );

    useEffect(() => {
        setLayout(layoutWords(wordsRef, segmentedWordsRef));
    }, [words]);

    const wordFontSize = 20;
    const wordFontFamily = '"Times New Roman"';
    const wordFontMetrics = fontService.getFontMetrics(wordFontFamily);

    const segmentedWordFontSize = 50;
    const segmentedWordFontFamily = '"Hafs"';
    const segmentedWordFontMetrics = fontService.getFontMetrics(segmentedWordFontFamily);

    return (
        <svg className='svg-view' width={500} height={500}>
            {
                words.map((word, i) => (
                    <SVGText
                        key={`word-${i}`}
                        ref={wordsRef[i]}
                        text={word}
                        fontFamily={wordFontFamily}
                        fontSize={wordFontSize}
                        fontMetrics={wordFontMetrics}
                        box={layout.textBoxes[i]} />
                ))
            }
            {
                segmentedWords.map((word, i) => (
                    <SVGSegmentedText
                        key={`segmented-word-${i}`}
                        ref={segmentedWordsRef[i]}
                        segments={word.segments}
                        classNames={word.classNames}
                        fontFamily={segmentedWordFontFamily}
                        fontSize={segmentedWordFontSize}
                        fontMetrics={segmentedWordFontMetrics}
                        box={layout.segmentedTextBoxes[i]} />
                ))
            }
        </svg>
    )
}