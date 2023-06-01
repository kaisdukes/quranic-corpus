import { ArrowButton } from '../components/arrow-button';
import './prev-next-navigation.scss';

export const PrevNextNavigation = () => {
    return (
        <div className='prev-next-navigation'>
            <ArrowButton enabled={false} />
            <ArrowButton right={true} enabled={true} />
        </div>
    )
}