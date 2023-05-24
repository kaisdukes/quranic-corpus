import { IconButton } from '../components/icon-button';
import read from './../images/icons/read.svg'
import './toolbar.scss';

export const Toolbar = () => {
    return (
        <div className='toolbar'>
            <IconButton icon={read} onClick={() => console.log('TOGGLE READER MODE')} />
        </div>
    )
}