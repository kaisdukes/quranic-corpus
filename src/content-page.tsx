import { ReactNode } from 'react';
import { NavigationBar, NavigationProps } from './navigation/navigation-bar';
import { Footer } from './components/footer';

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
            <Footer />
        </>
    )
}