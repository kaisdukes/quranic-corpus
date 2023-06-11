import { ReactNode } from 'react';
import { NavigationProps } from '../navigation/navigation';
import { NavigationBar } from '../navigation/navigation-bar';

type Props = {
    className: string,
    navigation: NavigationProps,
    children: ReactNode
}

export const ContentPage = ({ className, navigation, children }: Props) => {
    return (
        <>
            <NavigationBar {...navigation} />
            <main className={className}>
                {children}
            </main>
        </>
    )
}