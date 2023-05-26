import { Location } from '../corpus/location';

export const getVerseId = (location: Location) => `verse-${location[0]}-${location[1]}`;