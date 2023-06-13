import { ApiBase } from '../../app/api-base';
import { Verse } from '../orthography/verse';
import { WordMorphology } from './word-morphology';
import { formatLocation, Location } from '../orthography/location';
import { singleton } from 'tsyringe';
import axios from 'axios';

@singleton()
export class MorphologyService extends ApiBase {

    async getMorphology(location: Location, count: number, translations: string[]) {
        const response = await axios.get(
            this.url('/morphology'),
            {
                params: {
                    location: formatLocation(location),
                    n: count,
                    translation: translations.join(',')
                }
            });
        return response.data as Verse[];
    }

    async getWordMorphology(location: Location) {
        const response = await axios.get(
            this.url('/morphology/word'),
            { params: { location: formatLocation(location) } });
        return response.data as WordMorphology;
    }
}