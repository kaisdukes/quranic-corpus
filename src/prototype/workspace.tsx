import { useState } from 'react';
import { SidePanel } from './side-panel';
import './workspace.scss';

export const Workspace = () => {
    const [leftSplitterPosition, setLeftSplitterPosition] = useState(200);
    const [rightSplitterPosition, setRightSplitterPosition] = useState(400);

    return (
        <div className='workspace'>
            <SidePanel splitterPosition={leftSplitterPosition} onSplitterPositionChanged={setLeftSplitterPosition}>
                {
                    (() => {
                        const elements = [];
                        for (let i = 1; i <= 20; i++) {
                            elements.push(<div>Left {i}</div>)
                        }
                        return elements;
                    })()
                }
            </SidePanel>
            <div className='content'>
                {
                    (() => {
                        const elements = [];
                        for (let i = 1; i <= 30; i++) {
                            elements.push(<div>Main {i}</div>)
                        }
                        return elements;
                    })()
                }
            </div>
            <SidePanel right splitterPosition={rightSplitterPosition} onSplitterPositionChanged={setRightSplitterPosition}>
                {
                    (() => {
                        const elements = [];
                        for (let i = 1; i <= 100; i++) {
                            elements.push(<div>Right {i}</div>)
                        }
                        return elements;
                    })()
                }
            </SidePanel>
        </div>
    )
}