import { NavigationBar } from '../navigation/navigation-bar';
import { NavigationProps } from '../navigation/navigation';
import './side-panel.scss';
import { Dispatch, SetStateAction } from 'react';

type Props = {
    navigation: NavigationProps,
    whenClick: Dispatch<SetStateAction<boolean>>,
    className: string
}

export const SidePanel = ({navigation, whenClick, className}: Props) => {

    const hidePanel = () => {
        whenClick(false)
    }

    return (
        <div className={className}>
            <NavigationBar {...navigation}/>
            <button className={'button'} onClick={hidePanel}>{'Click to close'}</button>
        </div>
    )
}