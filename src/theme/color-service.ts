import { Segment } from '../corpus/morphology/segment';
import { singleton } from 'tsyringe';

@singleton()
export class ColorService {

    getSegmentColor(segment: Segment): string {
        switch (segment.posTag) {
            case 'DET':
                return 'gray';
            case 'N':
                return 'sky';
            case 'P':
                return 'rust';
            case 'PRON':
                return segment.pronounType === 'subj' ? 'sky' : 'metal';
            case 'REM':
                return 'navy';
            case 'V':
                return 'seagreen';
        }
    }
}