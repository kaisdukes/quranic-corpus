import { useEffect, useMemo, useState, createRef, RefObject } from 'react';
import { SVGWord } from './svg-word';
import { Position } from '../layout/geometry';

type Props = {
    words: string[]
}

type Layout = {
    wordPositions: Position[]
}

const layoutWords = (elements: RefObject<SVGTextElement>[]): Layout => {
    const wordPositions: Position[] = [];
    let x = 0;

    for (const element of elements) {
        if (element.current) {
            const { width, height } = element.current.getBBox();
            wordPositions.push({ x, y: height });
            x += width + 5;
        }
    }

    return { wordPositions }
}

export const TextChainView = ({ words }: Props) => {
    const [layout, setLayout] = useState<Layout>({
        wordPositions: []
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
        </svg>
    )
}