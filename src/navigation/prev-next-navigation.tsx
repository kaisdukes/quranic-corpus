import { ArrowButton } from '../components/arrow-button';
import './prev-next-navigation.scss';

type Props = {
    prevUrl?: string,
    nextUrl?: string
}

export const PrevNextNavigation = ({ prevUrl, nextUrl }: Props) => {
    return (
        <div className='prev-next-navigation'>
            <ArrowButton url={prevUrl} />
            <ArrowButton right={true} url={nextUrl} />
        </div>
    )
}