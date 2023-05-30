import { ApiBase } from '../../api-base';
import { Verse } from '../orthography/verse';
import { singleton } from 'tsyringe';
import { formatLocation, Location } from '../location';
import axios from 'axios';

@singleton()
export class MorphologyService extends ApiBase {

    async getMorphology(location: Location, count: number) {
        const response = await axios.get(
            this.url('/morphology'),
            {
                params: {
                    location: formatLocation(location),
                    n: count,
                    translation: 'sahih-international'
                }
            });
        return response.data as Verse[];
    }
}