import { Location } from '../location';
import { Token } from './token';

export type VerseMark = 'section' | 'sajdah';

export type Verse = {
    location: Location,
    tokens: Token[],
    translation: string,
    verseMark?: VerseMark
}