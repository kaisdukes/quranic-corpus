import { Fragment, useState } from 'react';
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
    const [mainContent, setMainContent] = useState(['Main']);
    const [infoContent, setInfoContent] = useState(['Info']);
    const [focusMode, setFocusMode] = useState(false);
    const [showInfo, setShowInfo] = useState(true);

    const addContent = () => {
        setMainContent(mainContent => [...mainContent, ...Array(10).fill('Main')]);
        setInfoContent(infoContent => [...infoContent, ...Array(5).fill('Info')]);
    }

    const toggleFocusMode = () => setFocusMode(focusMode => !focusMode);
    const toggleInfo = () => setShowInfo(showInfo => !showInfo);

    return (
        <>
            <div className='app-header'>HEADER</div>
            <div className='workspace'>
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
                    <div className='info-pane'>
                        <button onClick={addContent}>Add</button><br />
                        <TestView content={infoContent} />
                    </div>
                }
                <Footer mobile={true} />
            </div>
        </>
    );
};