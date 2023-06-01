import { SyntaxGraph } from './syntax-graph';
import { DependencyTag } from './dependency-tag';
import { singleton } from 'tsyringe';

@singleton()
export class SyntaxService {
    private arabicTerms: Map<DependencyTag, string> = new Map([
        ['circ', 'حال'],
        ['gen', 'مجرور'],
        ['link', 'متعلق'],
        ['obj', 'مفعول به'],
        ['subj', 'فاعل']
    ]);

    getSyntax() {
        return new SyntaxGraph({
            tokens: [
                {
                    location: [4, 79, 13],
                    translation: 'And We have sent you',
                    phonetic: 'wa-arsalnāka',
                    root: 'rsl',
                    segments: [
                        { arabic: 'وَ', posTag: 'REM' },
                        { arabic: 'أَرْسَلْ', posTag: 'V' },
                        { arabic: 'نَٰ', posTag: 'PRON', pronounType: 'subj' },
                        { arabic: 'كَ', posTag: 'PRON', pronounType: 'obj' }]
                },
                {
                    location: [4, 79, 14],
                    translation: 'for the people',
                    phonetic: 'lilnnāsi',
                    root: 'nws',
                    segments: [
                        { arabic: 'لِ', posTag: 'P' },
                        { arabic: 'ل', posTag: 'DET' },
                        { arabic: 'نَّاسِ', posTag: 'N' }
                    ]
                },
                {
                    location: [4, 79, 15],
                    translation: '(as) a Messenger',
                    phonetic: 'rasūlan',
                    root: 'rsl',
                    segments: [
                        { arabic: 'رَسُولًاۚ', posTag: 'N' }
                    ]
                }
            ],
            edges: [
                {
                    startNode: 2,
                    endNode: 1,
                    dependencyTag: 'subj'
                },
                {
                    startNode: 3,
                    endNode: 1,
                    dependencyTag: 'obj'
                },
                {
                    startNode: 5,
                    endNode: 4,
                    dependencyTag: 'gen'
                },
                {
                    startNode: 7,
                    endNode: 1,
                    dependencyTag: 'link'
                },
                {
                    startNode: 6,
                    endNode: 1,
                    dependencyTag: 'circ'
                }
            ],
            phraseNodes: [
                {
                    startNode: 4,
                    endNode: 5,
                    phraseTag: 'PP'
                }
            ]
        });
    }

    getArabicTerm(dependencyTag: DependencyTag): string {
        return this.arabicTerms.get(dependencyTag) || '?';
    }
}