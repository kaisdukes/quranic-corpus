import { Translation } from './translation';
import { CorpusError } from '../../errors/corpus-error';
import { singleton } from 'tsyringe';

@singleton()
export class TranslationService {
    private _translations: Translation[] | null = null;

    get translations(): Translation[] {
        if (!this._translations) {
            throw new CorpusError('SERVICE_ERROR', 'Translations not loaded.');
        }
        return this._translations;
    }

    set translations(translations: Translation[]) {
        this._translations = translations;
    }
}