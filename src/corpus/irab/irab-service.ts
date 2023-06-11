import { ApiBase } from '../../app/api-base';
import { Location } from '../orthography/location';
import { formatLocation } from '../orthography/location';
import { singleton } from 'tsyringe';
import axios from 'axios';

@singleton()
export class IrabService extends ApiBase {

    async getIrab(from: Location, to: Location) {
        const response = await axios.get(
            this.url('/irab'),
            {
                params: {
                    from: formatLocation(from),
                    to: formatLocation(to)
                }
            });

        return response.data as string[];
    }
}