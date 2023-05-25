import { IconButton } from '../components/icon-button';
import { useReaderSettings } from '../context/reader-settings-context';
import read from './../images/icons/read.svg'
import detail from './../images/icons/detail.svg'
import './toolbar.scss';

export const Toolbar = () => {
    const { readerSettings, setReaderSettings } = useReaderSettings();
    const { readerMode } = readerSettings;

    const toggleReaderMode = () => {
        setReaderSettings({
            ...readerSettings,
            readerMode: !readerMode
        });
    };

    return (
        <div className='toolbar'>
            <IconButton icon={readerMode ? detail : read} onClick={toggleReaderMode} />
        </div>
    )
}