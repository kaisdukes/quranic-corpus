import { Location } from '../corpus/orthography/location';
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
            <div className='header'>
                <CloseButton url={url} />
            </div>
            *** TEST ***<br />
            Location: {formatLocation(location)}<br />
        </div>
    )
}