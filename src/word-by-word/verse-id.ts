import { Location } from '../corpus/orthography/location';

export const getVerseId = (location: Location) => `verse-${location[0]}-${location[1]}`;