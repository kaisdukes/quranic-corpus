import { useRef, useEffect, useState, RefObject } from 'react';
import { Position, Rect } from '../layout/geometry';
import { ArabicTextService } from '../arabic/arabic-text-service';
import { container } from 'tsyringe';
import './svg-test.scss';

export type GraphLayout = {
    position: Position,
    rect: Rect,
    layoutUpdated: boolean
}

export const SVGTest = () => {
    const text = 'بِٱلْحَقِّ';
    const classNames = ['a', 'b', 'c'];
    const segments = [text.slice(0, 2), text.slice(2, 5), text.slice(5, 10)];
    const arabicTextService = container.resolve(ArabicTextService);
    arabicTextService.insertZeroWidthJoinersForSafari(segments);

    const textRef = useRef<SVGTextElement>(null);
    const [graphLayout, setGraphLayout] = useState<GraphLayout>({
        position: { x: 200, y: 200 },
        rect: { x: 0, y: 0, width: 0, height: 0 },
        layoutUpdated: false,
    });

    // Measurement phase
    useEffect(() => {
        if (textRef.current) {
            const bounds: Rect = textRef.current.getBBox();
            console.log('BOUNDS = ' + JSON.stringify(bounds)); // ERROR! empty object!
            setGraphLayout(prevLayout => ({ ...prevLayout, rect: bounds }));
        }
    }, [textRef]);

    // Layout phase
    useEffect(() => {
        if (!graphLayout.layoutUpdated) {
            setGraphLayout(prevLayout => {
                const position = {
                    x: 200 - prevLayout.rect.width / 2,
                    y: 200 - prevLayout.rect.height / 2
                };
                return { ...prevLayout, position, layoutUpdated: true };
            });
        }
    }, [graphLayout]);

    return (
        <div className='svg-test'>
            <h1>SVG Test</h1>
            <svg width={400} height={400}>
                {
                    graphLayout.layoutUpdated &&
                    <SVGRect position={graphLayout.position} rect={graphLayout.rect} />
                }
                <SVGText textRef={textRef} position={graphLayout.position} segments={segments} classNames={classNames} />
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
            x={position.x + rect.x}
            y={position.y + rect.y}
            width={rect.width}
            height={rect.height}
            fill='none'
            stroke='red' />
    )
}