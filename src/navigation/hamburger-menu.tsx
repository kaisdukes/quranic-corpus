import { MouseEvent } from 'react';
import { useSettings } from '../context/settings-context';
import { TranslationService } from '../corpus/translation/translation-service';
import { container } from 'tsyringe';
import read from './../images/icons/read.svg'
import tick from './../images/icons/tick.svg'
import './hamburger-menu.scss';

type Props = {
    onClose: () => void
}

export const HamburgerMenu = ({ onClose }: Props) => {
    const translationService = container.resolve(TranslationService);
    const translations = translationService.translations;

    const { settings, setSettings } = useSettings();
    const { readerMode } = settings;

    const toggleReaderMode = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setSettings({
            ...settings,
            readerMode: !readerMode
        })
        onClose();
    }

    return (
        <div className='hamburger-menu'>
            <a href='#' onClick={toggleReaderMode}>
                <img src={read} />
                {readerMode ? 'Reader mode' : 'Detail mode'}
            </a>
            <div className='translations'>Translations:</div>
            {
                translations.map(translation => (
                    <a href='#'>
                        <img src={tick} />
                        {translation.name}
                    </a>
                ))
            }
        </div>
    )
}