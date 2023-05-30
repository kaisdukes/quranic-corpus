import { MouseEvent } from 'react';
import { useReaderSettings } from '../context/reader-settings-context';
import { TranslationService } from '../corpus/translation/translation-service';
import { container } from 'tsyringe';
import read from './../images/icons/read.svg'
import tick from './../images/icons/tick.svg'
import './hamburger-menu.scss';

export const HamburgerMenu = () => {
    const translationService = container.resolve(TranslationService);
    const translations = translationService.translations;

    const { readerSettings, setReaderSettings } = useReaderSettings();
    const { readerMode } = readerSettings;

    const toggleReaderMode = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setReaderSettings({
            ...readerSettings,
            readerMode: !readerMode
        })
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