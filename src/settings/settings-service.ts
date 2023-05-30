import { TranslationService } from '../corpus/translation/translation-service';
import { Settings } from '../settings/settings';
import { singleton } from 'tsyringe';
import { SettingsContextType } from '../settings/settings-context';
import { CorpusError } from '../errors/corpus-error';

@singleton()
export class SettingsService {
    private onChangeSettings: ((settings: Settings) => void) | undefined;
    private translationsKeys: Set<string> = new Set<string>();

    constructor(private readonly translationService: TranslationService) {
    }

    async loadSettings(settingsContext: SettingsContextType) {
        this.onChangeSettings = settingsContext._setSettings;
        const defaultSettings = settingsContext.settings;

        this.saveSettings({
            ...defaultSettings,
            translations: [this.translationService.translations[0].key]
        });
    }

    async saveSettings(settings: Settings) {
        if (!this.onChangeSettings) {
            throw new CorpusError('SERVICE_ERROR', 'Settings not loaded.');
        }

        // translation
        this.translationsKeys.clear();
        for (const key of settings.translations) {
            this.translationsKeys.add(key);
        }

        // notify
        this.onChangeSettings(settings);
    }

    hasTranslation(key: string) {
        return this.translationsKeys.has(key);
    }
}