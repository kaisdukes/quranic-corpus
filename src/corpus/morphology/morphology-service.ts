import { ApiBase } from '../../api-base';
import { Verse } from '../orthography/verse';
import { formatLocation, Location } from '../location';
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
}