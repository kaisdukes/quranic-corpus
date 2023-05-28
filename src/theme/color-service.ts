import { Segment } from '../corpus/morphology/segment';
import { singleton } from 'tsyringe';
import { PosTag } from '../corpus/morphology/pos-tag';
import { DependencyTag } from '../corpus/syntax/dependency-tag';

@singleton()
export class ColorService {

    private posTagColors: Map<PosTag, string> = new Map([
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

    private dependencyTagColors: Map<DependencyTag, string> = new Map([
        ['circ', 'seagreen'],
        ['gen', 'rust'],
        ['link', 'orange'],
        ['obj', 'metal'],
        ['subj', 'sky']
    ]);

    getSegmentColor(segment: Segment): string {
        const { posTag } = segment;
        const color = this.posTagColors.get(posTag);
        if (color) {
            return color;
        }
        if (posTag === 'PRON') {
            switch (segment.pronounType) {
                case 'subj':
                    return 'sky';
                case 'obj2':
                    return 'orange';
                default:
                    return 'metal';
            }
        }
        return 'pink';
    }

    getDependencyColor(dependencyTag: DependencyTag): string {
        return this.dependencyTagColors.get(dependencyTag) || 'black';
    }
}