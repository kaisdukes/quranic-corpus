import { Segment } from '../corpus/morphology/segment';
import { singleton } from 'tsyringe';
import { PosTag } from '../corpus/morphology/pos-tag';
import { PhraseTag } from '../corpus/syntax/phrase-tag';
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

    private phraseTagColors: Map<PhraseTag, string> = new Map([
        ['CS', 'orange'],
        ['PP', 'rust'],
        ['SC', 'gold'],
        ['VS', 'seagreen']
    ]);

    private dependencyTagColors: Map<DependencyTag, string> = new Map([
        ['adj', 'purple'],
        ['app', 'sky'],
        ['circ', 'seagreen'],
        ['cog', 'seagreen'],
        ['com', 'metal'],
        ['cond', 'orange'],
        ['cpnd', 'sky'],
        ['gen', 'rust'],
        ['int', 'orange'],
        ['intg', 'rose'],
        ['link', 'orange'],
        ['neg', 'red'],
        ['obj', 'metal'],
        ['pass', 'sky'],
        ['poss', 'sky'],
        ['pred', 'metal'],
        ['predx', 'metal'],
        ['prev', 'orange'],
        ['pro', 'red'],
        ['prp', 'metal'],
        ['spec', 'metal'],
        ['spec', 'sky'],
        ['sub', 'gold'],
        ['subj', 'sky'],
        ['subjx', 'sky'],
        ['voc', 'green']
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

    getPhraseColor(phraseTag: PhraseTag): string {
        return this.phraseTagColors.get(phraseTag) || 'blue';
    }

    getDependencyColor(dependencyTag: DependencyTag): string {
        return this.dependencyTagColors.get(dependencyTag) || 'pink';
    }
}