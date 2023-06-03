import { useEffect, useMemo, useState, createRef, RefObject } from 'react';
import { SVGWord } from './svg-word';
import { Position, Rect } from '../layout/geometry';

type Props = {
    words: string[]
}

type Layout = {
    wordPositions: Position[],
    boxes: Rect[]
}

const layoutWords = (elements: RefObject<SVGTextElement>[]): Layout => {
    const wordPositions: Position[] = [];
    const boxes: Rect[] = [];
    let x = 0;

    for (const element of elements) {
        if (element.current) {
            const { width, height } = element.current.getBBox();
            const y = height;
            wordPositions.push({ x, y });
            boxes.push({ x, y: 0, width, height });
            x += width + 5;
        }
    }

    return { wordPositions, boxes };
}

export const TextChainView = ({ words }: Props) => {
    const [layout, setLayout] = useState<Layout>({
        wordPositions: [],
        boxes: []
    });

    const wordsRef = useMemo(
        () => words.map(() => createRef<SVGTextElement>()),
        [words]
    );

    useEffect(() => {
        setLayout(layoutWords(wordsRef));
    }, [words]);

    return (
        <svg className='text-chain-view'>
            {
                words.map((word, i) => (
                    <SVGWord
                        key={`word-${i}`}
                        ref={wordsRef[i]}
                        word={word}
                        position={layout.wordPositions[i]} />
                ))
            }
            {
                layout.boxes.map((box, i) => (
                    <rect
                        key={`box-${i}`}
                        className='box'
                        x={box.x}
                        y={box.y}
                        width={box.width}
                        height={box.height} />
                ))
            }
        </svg>
    )
}