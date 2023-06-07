import { useRef, useState, useCallback, ReactNode, useEffect } from 'react';
import { combineClassNames } from '../theme/class-names';
import './side-panel.scss';

type Props = {
    children: ReactNode,
    right?: boolean,
    splitterPosition: number,
    onSplitterPositionChanged: (splitterPosition: number) => void
}

export const SidePanel = ({ children, right, splitterPosition, onSplitterPositionChanged }: Props) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const splitterRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !containerRef.current) return;

            const containerRect = containerRef.current.getBoundingClientRect();
            let newSplitterPosition;

            if (right) {
                newSplitterPosition = containerRect.right - e.clientX;
            } else {
                newSplitterPosition = e.clientX - containerRect.left;
            }

            onSplitterPositionChanged(newSplitterPosition);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        const handleMouseDown = (e: MouseEvent) => {
            setIsDragging(true);
            e.preventDefault();
        };

        if (splitterRef.current) {
            splitterRef.current.addEventListener('mousedown', handleMouseDown);
        }

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            if (splitterRef.current) {
                splitterRef.current.removeEventListener('mousedown', handleMouseDown);
            }
        };
    }, [isDragging, onSplitterPositionChanged, containerRef, splitterRef]);

    return (
        <div ref={containerRef} className={combineClassNames('side-panel', right ? 'right' : undefined)}>
            <div className='content' style={{ width: `${splitterPosition}px` }}>
                {children}
            </div>
            <div ref={splitterRef} className='splitter'>
                <div className='line' />
            </div>
        </div>
    );
}