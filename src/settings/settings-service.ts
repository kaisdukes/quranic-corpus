import { TranslationService } from '../corpus/translation/translation-service';
import { Settings } from '../settings/settings';
import { singleton } from 'tsyringe';
import { SettingsContextType } from '../settings/settings-context';
import { CorpusError } from '../errors/corpus-error';

@singleton()
export class SettingsService {
    private onChangeSettings: ((settings: Settings) => void) | undefined;
    private translationsKeys: Set<string> = new Set();

    constructor(private readonly translationService: TranslationService) {
    }

    async loadSettings(settingsContext: SettingsContextType) {
        this.onChangeSettings = settingsContext._setSettings;
        const defaultSettings = settingsContext.settings;
        const localSettings = JSON.parse(window.localStorage.getItem('settings') || '{}');

        const mergedSettings = {
            ...defaultSettings,
            ...localSettings,
            translations: localSettings.translations || [this.translationService.translations[0].key]
        };

        this.saveSettings(mergedSettings);
    }

    saveSettings(settings: Settings) {
        if (!this.onChangeSettings) {
            throw new CorpusError('SERVICE_ERROR', 'Settings not loaded.');
        }

        this.translationsKeys.clear();
        for (const key of settings.translations) {
            this.translationsKeys.add(key);
        }

        window.localStorage.setItem('settings', JSON.stringify(settings));
        this.onChangeSettings(settings);
    }

    hasTranslation(key: string) {
        return this.translationsKeys.has(key);
    }
}
