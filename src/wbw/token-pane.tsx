import { Location } from '../corpus/orthography/location';
import { IndeterminateProgressBar } from '../components/indeterminate-progress-bar';
import { CloseButton } from '../components/close-button';
import { formatLocation } from '../corpus/orthography/location';
import { useLocation } from 'react-router-dom';
import './token-pane.scss';

type Props = {
    location: Location
}

export const TokenPane = ({ location }: Props) => {
    const { pathname: url } = useLocation();
    return (
        <div className='token-pane'>
            <IndeterminateProgressBar/>
            <div className='header'>
                <CloseButton url={url} />
            </div>
            *** TEST ***<br />
            Location: {formatLocation(location)}<br />
        </div>
    )
}