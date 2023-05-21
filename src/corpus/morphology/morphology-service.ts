import { Verse } from '../orthography/verse';
import { singleton } from 'tsyringe';
import { formatLocation, Location } from '../location';
import axios from 'axios';

@singleton()
export class MorphologyService {
    private readonly baseUrl = 'https://qurancorpus.app/api';

    async getMorphology(location: Location, count: number) {
        const response = await axios.get(
            this.url('/morphology'),
            {
                params: {
                    location: formatLocation(location),
                    n: count
                }
            });
        return response.data as Verse[];
    }

    private url = (relativePath: string) => this.baseUrl + relativePath;
}