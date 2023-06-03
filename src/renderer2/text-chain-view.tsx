import { useEffect, useMemo, useState, createRef, RefObject } from 'react';
import { SVGWord } from './svg-word';
import { Position } from '../layout/geometry';

type Props = {
    words: string[]
}

export const TextChainView = ({ words }: Props) => {
    const wordsRef = useMemo(
        () => words.map(() => createRef<SVGTextElement>()),
        [words]
    );

    const [wordPositions, setWordPositions] = useState<Position[]>(
        () => Array.from({ length: words.length }, () => ({ x: 0, y: 0 }))
    );

    useEffect(() => {
        const positions = layoutWords(wordsRef);
        setWordPositions(positions);
    }, [words]);

    const layoutWords = (elements: RefObject<SVGTextElement>[]) => {
        const positions: Position[] = [];
        let x = 0;

        for (const element of elements) {
            if (element.current) {
                const { width, height } = element.current.getBBox();
                positions.push({ x, y: height });
                x += width + 5;
            }
        }

        return positions;
    };

    return (
        <svg className='text-chain-view'>
            {words.map((word, i) => (
                <SVGWord key={`word-${i}`} ref={wordsRef[i]} word={word} position={wordPositions[i]} />
            ))}
        </svg>
    )
}