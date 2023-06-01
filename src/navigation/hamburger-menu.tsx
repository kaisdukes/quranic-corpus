import { MouseEvent } from 'react';
import { useSettings } from '../settings/settings-context';
import { TranslationService } from '../corpus/translation/translation-service';
import { SettingsService } from '../settings/settings-service';
import { container } from 'tsyringe';
import read from './../images/icons/read.svg'
import tick from './../images/icons/tick.svg'
import './hamburger-menu.scss';

type Props = {
    onClose: () => void
}

export const HamburgerMenu = ({ onClose }: Props) => {
    const translationService = container.resolve(TranslationService);
    const settingsService = container.resolve(SettingsService);
    const translations = translationService.translations;

    const { settings } = useSettings();
    const { readerMode } = settings;

    const toggleReaderMode = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        settingsService.saveSettings({
            ...settings,
            readerMode: !readerMode
        })
        onClose();
    }

    const toggleTranslation = (e: MouseEvent<HTMLAnchorElement>, key: string) => {
        e.preventDefault();
        settingsService.saveSettings({
            ...settings,
            translations: translationService.toggleTranslation(settings.translations, key)
        });
        onClose();
    }

    return (
        <div className='hamburger-menu'>
            <a href='#' onClick={toggleReaderMode}>
                <div className='icon-container'>
                    <img src={read} />
                </div>
                {readerMode ? 'Detail mode' : 'Reader mode'}
            </a>
            <div className='translations'>Translations:</div>
            {
                translations.map((translation, i) => {
                    const { key, name } = translation;
                    return (
                        <a key={`translation-${i}`} href='#' onClick={e => toggleTranslation(e, key)}>
                            <div className='icon-container'>
                                {
                                    settingsService.hasTranslation(key) &&
                                    <img src={tick} />
                                }
                            </div>
                            {name}
                        </a>
                    )
                })
            }
        </div>
    )
}