import { Segment } from '../corpus/morphology/segment';
import { singleton } from 'tsyringe';

@singleton()
export class ColorService {

    private posTagColors: Map<string, string> = new Map([
        ['ADJ', 'purple'],
        ['CIRC', 'navy'],
        ['COM', 'navy'],
        ['COND', 'orange'],
        ['CONJ', 'navy'],
        ['DEM', 'brown'],
        ['DET', 'gray'],
        ['INL', 'orange'],
        ['INTG', 'rose'],
        ['LOC', 'orange'],
        ['N', 'sky'],
        ['NEG', 'red'],
        ['PN', 'blue'],
        ['P', 'rust'],
        ['PREV', 'orange'],
        ['PRP', 'gold'],
        ['PRO', 'red'],
        ['REL', 'gold'],
        ['REM', 'navy'],
        ['RSLT', 'navy'],
        ['SUB', 'gold'],
        ['T', 'orange'],
        ['V', 'seagreen'],
        ['VOC', 'green']
    ]);

    getSegmentColor(segment: Segment): string {
        const { posTag } = segment;
        const color = this.posTagColors.get(posTag);
        if (color) {
            return color;
        }
        if (posTag === 'PRON') {
            return segment.pronounType === 'subj' ? 'sky' : 'metal';
        }
        return 'pink';
    }
}