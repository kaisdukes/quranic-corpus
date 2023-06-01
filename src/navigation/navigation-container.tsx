import { ReactNode } from 'react';
import { NavigationHeader, NavigationProps } from '../navigation/navigation-header';

type Props = NavigationProps & {
    children: ReactNode
}

export const NavigationContainer = ({ children, ...rest }: Props) => {
    return (
        <div className='navigation-container'>
            <NavigationHeader {...rest} />
            {children}
        </div>
    )
}