import { useRef, useEffect, useState, RefObject } from 'react';
import { Position, Rect } from '../layout/geometry';
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
    const [rect, setRect] = useState<Rect>();

    useEffect(() => {
        if (textRef.current) {
            const bounds: Rect = textRef.current.getBBox();
            console.log('BOUNDS = ' + JSON.stringify(bounds)); // EMPTY OBJECT!
            setPosition({
                x: 200 - bounds.width / 2,
                y: 200 - bounds.height / 2
            });
            setRect(bounds);
        }
    }, [textRef]);

    return (
        <div className='svg-test'>
            <h1>SVG Test</h1>
            <svg width={400} height={400}>
                {
                    rect &&
                    <SVGRect position={position} rect={rect} />
                }
                <SVGText textRef={textRef} position={position} segments={segments} classNames={classNames} />
            </svg>
        </div>
    )
}

type SVGTextProps = {
    textRef: RefObject<SVGTextElement>,
    position: Position,
    segments: string[],
    classNames: string[]
}

const SVGText = ({ textRef, position, segments, classNames }: SVGTextProps) => {
    return (
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
    )
}

type SVGRectProps = {
    position: Position,
    rect: Rect
}

const SVGRect = ({ position, rect }: SVGRectProps) => {
    return (
        <rect
            x1={position.x + rect.x}
            y1={position.y + rect.y}
            width={rect.width}
            height={rect.height}
            fill='none'
            stroke='red' />
    )
}