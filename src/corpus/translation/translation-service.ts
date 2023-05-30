import { Translation } from './translation';
import { CorpusError } from '../../errors/corpus-error';
import { singleton } from 'tsyringe';

type TranslationInfo = {
    key: string,
    name: string,
    order: number
}

@singleton()
export class TranslationService {
    private _translations: TranslationInfo[] | null = null;

    get translations(): TranslationInfo[] {
        if (!this._translations) {
            throw new CorpusError('SERVICE_ERROR', 'Translations not loaded.');
        }
        return this._translations;
    }

    set translations(translations: Translation[]) {
        this._translations = translations.map((t, index) => ({
            ...t,
            order: index
        }));
    }

    toggleTranslation(currentTranslations: string[], key: string): string[] {

        // remove
        const keyIndex = currentTranslations.indexOf(key);
        if (keyIndex !== -1) {
            const newTranslations = [...currentTranslations];
            newTranslations.splice(keyIndex, 1);
            return newTranslations;
        }

        //  add while preserving order
        const orderedTranslations = this.translations.filter(t => currentTranslations.includes(t.key));
        orderedTranslations.push(this.translations.find(t => t.key === key)!);
        orderedTranslations.sort((a, b) => a.order - b.order);
        return orderedTranslations.map(t => t.key);
    }
}