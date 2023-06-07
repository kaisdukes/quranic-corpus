import { useState } from 'react';
import { SidePanel } from './side-panel';
import './workspace.scss';

export const Workspace = () => {
    const [leftSplitterPosition, setLeftSplitterPosition] = useState(200);
    const [rightSplitterPosition, setRightSplitterPosition] = useState(400);

    return (
        <div className='workspace'>
            <SidePanel splitterPosition={leftSplitterPosition} onSplitterPositionChanged={setLeftSplitterPosition}>
                Left Content
            </SidePanel>
            <div className='main-content'>Main Content</div>
            <SidePanel right splitterPosition={rightSplitterPosition} onSplitterPositionChanged={setRightSplitterPosition}>
                Right Content
            </SidePanel>
        </div>
    )
}
