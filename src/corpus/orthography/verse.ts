import { Location } from './location';
import { Token } from './token';

export type VerseMark = 'section' | 'sajdah';

export type VerseTranslation = {
    name: string,
    translation: string
}

export type Verse = {
    location: Location,
    tokens: Token[],
    translations: VerseTranslation[],
    verseMark?: VerseMark
}