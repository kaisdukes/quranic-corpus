import { Link } from 'react-router-dom';
import './close-button.scss';

type Props = {
    url: string
}

export const CloseButton = ({ url }: Props) => {
    return (
        <Link to={url} className='close-button'>
            <svg
                viewBox='0 0 100 100'>
                <path
                    stroke='currentColor'
                    strokeWidth={3.5}
                    d='M 38 38 L 62 62 M 62 38 L 38 62' />
            </svg>
        </Link>
    )
}