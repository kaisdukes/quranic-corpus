import { ReactNode, useEffect, useRef, useState } from 'react';
import { NavigationBar } from '../navigation/navigation-bar';
import { NavigationProps } from '../navigation/navigation';
import { Footer } from '../components/footer';
import { combineClassNames } from '../theme/class-names';
import './workspace.scss';

type Props = {
    className: string,
    navigation: NavigationProps,
    focusMode: boolean,
    children: ReactNode,
    info?: ReactNode
}

export const Workspace = ({ className, navigation, focusMode, children, info }: Props) => {

    // Layout Overview:
    // - In this component "mobile" refers to a window size less than 600 pixels.
    // - This typically means most mobile devices in portrait orientation.

    // Mobile Layout:
    // - Single column with natural sizing.
    // - Arranged in a linear flow with three sections: main content, info pane, and footer.

    // Desktop Layout:
    // - Configured as a two-column layout with each column scrolling independently.
    // - Info pane is positioned as a side panel on the right that can be resized with a splitter.

    // Popup Info Pane:
    // - Activated only in focus mode and exclusively on mobile devices.
    // - Covers the bottom 2/3rds of the screen when displayed.
    // - It's independently scrollable, without affecting the scroll position of the main content.

    const [infoPaneWidth, setInfoPaneWidth] = useState(300);
    const workspaceRef = useRef<HTMLDivElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const splitterRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (focusMode && info) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    }, [focusMode, info]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !workspaceRef.current) return;
            const containerRect = workspaceRef.current.getBoundingClientRect();
            const newSplitterPosition = containerRect.right - e.clientX;
            setInfoPaneWidth(newSplitterPosition);
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
    }, [isDragging, workspaceRef, splitterRef]);

    return (
        <>
            <NavigationBar {...navigation} />
            <div
                ref={workspaceRef}
                className='workspace'
                style={{ gridTemplateColumns: info ? `1fr 10px ${infoPaneWidth}px` : `1fr` }}>
                <main className={className}>
                    {children}
                    <Footer type='desktop' />
                </main>
                <div ref={splitterRef} className={combineClassNames('splitter', !info ? 'hide' : undefined)}>
                    <div className='line' />
                </div>
                {
                    info &&
                    <div className={combineClassNames('info-pane', focusMode ? 'popup' : undefined)}>
                        {info}
                    </div>
                }
                <Footer type='mobile' />
            </div>
        </>
    )
}