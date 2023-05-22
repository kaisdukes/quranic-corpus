import { ReactNode } from 'react';
import './navigation-container.scss';

type Props = {
    header: ReactNode,
    children: ReactNode
}

export const NavigationContainer = ({ header, children }: Props) => {
    return (
        <div className='navigation-container'>
            <div className='sticky-header'>{header}</div>
            <div className='content'>
                {children}
            </div>
        </div>
    )
}