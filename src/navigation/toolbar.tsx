import { IconButton } from '../components/icon-button';
import { useReaderSettings } from '../context/reader-settings-context';
import read from './../images/icons/read.svg'
import './toolbar.scss';

export const Toolbar = () => {
    const { readerSettings, setReaderSettings } = useReaderSettings();

    const toggleReaderMode = () => {
        setReaderSettings({
            ...readerSettings,
            readerMode: !readerSettings.readerMode
        });
    };

    return (
        <div className='toolbar'>
            <IconButton icon={read} onClick={toggleReaderMode} />
        </div>
    )
}