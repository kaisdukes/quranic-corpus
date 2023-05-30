import { ApiBase } from '../../api-base';
import { Verse } from '../orthography/verse';
import { TranslationService } from '../translation/translation-service';
import { formatLocation, Location } from '../location';
import { singleton } from 'tsyringe';
import axios from 'axios';

@singleton()
export class MorphologyService extends ApiBase {

    constructor(private readonly translationService: TranslationService) {
        super();
    }

    async getMorphology(location: Location, count: number) {
        const response = await axios.get(
            this.url('/morphology'),
            {
                params: {
                    location: formatLocation(location),
                    n: count,
                    translation: this.translationService.translations[0].key
                }
            });
        return response.data as Verse[];
    }
}