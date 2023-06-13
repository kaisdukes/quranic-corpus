import { Token } from '../orthography/token';

export type WordMorphology = {
    token: Token,
    summary: string,
    segmentDescriptions: string[],
    arabicGrammar: string
}