import { Location } from './location';
import { Segment } from '../morphology/segment';

export type Token = {
    location: Location,
    translation: string,
    phonetic: string,
    segments: Segment[]
}