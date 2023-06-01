import { ArrowButton } from '../components/arrow-button';
import './prev-next-navigation.scss';

type Props = {
    prevEnabled: boolean,
    nextEnabled: boolean,
    onClick: (next: boolean) => void
}

export const PrevNextNavigation = ({ prevEnabled, nextEnabled, onClick }: Props) => {
    return (
        <div className='prev-next-navigation'>
            <ArrowButton enabled={prevEnabled} onClick={() => onClick(false)} />
            <ArrowButton right={true} enabled={nextEnabled} onClick={() => onClick(true)} />
        </div>
    )
}