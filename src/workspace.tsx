import { Fragment, useEffect, useRef, useState } from 'react';
import { combineClassNames } from './theme/class-names';
import './workspace.scss';

type TestProps = {
    content: string[]
}

const TestView = ({ content }: TestProps) => {
    return (
        <>
            {content.map((line, index) => (
                <Fragment key={index}>
                    {line}
                    <br />
                </Fragment>
            ))}
        </>
    );
}

type FooterProps = {
    mobile?: boolean
}

const Footer = ({ mobile }: FooterProps) => {
    return (
        <div className={combineClassNames('footer', mobile ? 'mobile' : 'desktop')}>
            Copyright &copy; 2009-2023.
        </div>
    )
}

export const Workspace = () => {

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

    const [mainContent, setMainContent] = useState(['Main']);
    const [infoContent, setInfoContent] = useState(['Info']);
    const [focusMode, setFocusMode] = useState(false);
    const [showInfo, setShowInfo] = useState(true);

    const [infoPaneWidth, setInfoPaneWidth] = useState(300);
    const workspaceRef = useRef<HTMLDivElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const splitterRef = useRef<HTMLDivElement | null>(null);

    const addContent = () => {
        setMainContent(mainContent => [...mainContent, ...Array(10).fill('Main')]);
        setInfoContent(infoContent => [...infoContent, ...Array(5).fill('Info')]);
    }

    const toggleFocusMode = () => setFocusMode(focusMode => !focusMode);
    const toggleInfo = () => setShowInfo(showInfo => !showInfo);

    useEffect(() => {
        if (focusMode && showInfo) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    }, [focusMode, showInfo]);

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
            <div className='app-header'>HEADER</div>
            <div ref={workspaceRef} className='workspace' style={{ gridTemplateColumns: `1fr 10px ${infoPaneWidth}px` }}>
                <div className='main-pane'>
                    <button onClick={toggleFocusMode}>{focusMode ? 'Focus Mode' : 'Normal Mode'}</button><br />
                    {
                        focusMode &&
                        <><button onClick={toggleInfo}>{showInfo ? 'Info On' : 'Info Off'}</button><br /></>
                    }
                    <TestView content={mainContent} />
                    <Footer />
                </div>
                {
                    showInfo &&
                    <>
                        <div ref={splitterRef} className='splitter'>
                            <div className='line' />
                        </div>
                        <div className={combineClassNames('info-pane', focusMode && showInfo ? 'popup' : undefined)}>
                            <button onClick={addContent}>Add</button><br />
                            <TestView content={infoContent} />
                        </div>
                    </>
                }
                <Footer mobile={true} />
            </div>
        </>
    )
}