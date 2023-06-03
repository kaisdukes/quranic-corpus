import { useEffect, useMemo, useState, createRef, RefObject } from 'react';
import { SVGText } from './svg-text';
import { Rect } from '../layout/geometry';
import { FontService } from '../typography/font-service';
import { container } from 'tsyringe';
import './svg-view.scss';

type Props = {
    words: string[]
}

type Layout = {
    textBoxes: Rect[]
}

const layoutWords = (elements: RefObject<SVGTextElement>[]): Layout => {
    const textBoxes: Rect[] = [];
    let x = 0;

    for (const element of elements) {
        if (element.current) {
            const { width, height } = element.current.getBBox();
            const y = 0;
            textBoxes.push({ x, y, width, height });
            x += width + 5;
        }
    }

    return { textBoxes };
}

export const SVGView = ({ words }: Props) => {
    const fontService = container.resolve(FontService);

    const [layout, setLayout] = useState<Layout>({
        textBoxes: []
    });

    const wordsRef = useMemo(
        () => words.map(() => createRef<SVGTextElement>()),
        [words]
    );

    useEffect(() => {
        setLayout(layoutWords(wordsRef));
    }, [words]);

    const fontFamily = '"Times New Roman"';
    const fontSize = 30;
    const descenderHeight = fontService.getDescenderHeight(fontFamily);

    return (
        <svg className='svg-view'>
            {
                words.map((word, i) => (
                    <SVGText
                        key={`word-${i}`}
                        ref={wordsRef[i]}
                        text={word}
                        fontFamily={fontFamily}
                        fontSize={fontSize}
                        descenderHeight={descenderHeight}
                        box={layout.textBoxes[i]} />
                ))
            }
        </svg>
    )
}