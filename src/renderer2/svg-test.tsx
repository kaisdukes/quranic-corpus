import { useRef, useEffect, useState } from 'react';
import { Rect } from '../layout/geometry';
import { ArabicTextService } from '../arabic/arabic-text-service';
import { container } from 'tsyringe';
import './svg-test.scss';

export const SVGTest = () => {
    const text = 'بِٱلْحَقِّ';
    const classNames = ['a', 'b', 'c'];
    const segments = [text.slice(0, 2), text.slice(2, 5), text.slice(5, 10)];

    const arabicTextService = container.resolve(ArabicTextService);
    arabicTextService.insertZeroWidthJoinersForSafari(segments);

    const textRef = useRef<SVGTextElement>(null);
    const [position, setPosition] = useState({ x: 200, y: 200 });

    useEffect(() => {
        if (textRef.current) {
            const bounds: Rect = textRef.current.getBBox();
            setPosition({
                x: 200 - bounds.width / 2,
                y: 200 - bounds.height / 2
            });
        }
    }, [segments]);

    return (
        <div className='svg-test'>
            <h1>SVG Test</h1>
            <svg width={400} height={400}>
                <text
                    ref={textRef}
                    x={position.x}
                    y={position.y}>
                    {
                        segments.map((segment, i) =>
                            <tspan
                                key={i}
                                className={`bar ${classNames[i]}`}
                                dangerouslySetInnerHTML={{ __html: segment }} />
                        )
                    }
                </text>
            </svg>
        </div>
    )
}