import { Token } from '../orthography/token';
import { singleton } from 'tsyringe';

@singleton()
export class MorphologyService {

    getMorphology(): Token[] {
        return [
            {
                location: [4, 79, 13],
                translation: 'And We have sent you',
                phonetic: 'wa-arsalnāka',
                root: 'rsl',
                segments: [
                    { text: 'وَ', posTag: 'REM' },
                    { text: 'أَرْسَلْ', posTag: 'V' },
                    { text: 'نَٰ', posTag: 'PRON', pronounType: 'subj' },
                    { text: 'كَ', posTag: 'PRON', pronounType: 'obj' }]
            },
            {
                location: [4, 79, 14],
                translation: 'for the people',
                phonetic: 'lilnnāsi',
                root: 'nws',
                segments: [
                    { text: 'لِ', posTag: 'P' },
                    { text: 'ل', posTag: 'DET' },
                    { text: 'نَّاسِ', posTag: 'N' }
                ]
            },
            {
                location: [4, 79, 15],
                translation: '(as) a Messenger',
                phonetic: 'rasūlan',
                root: 'rsl',
                segments: [
                    { text: 'رَسُولًاۚ', posTag: 'N' }
                ]
            }
        ]
    }
}