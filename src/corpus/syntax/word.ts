import { PosTag } from '../morphology/pos-tag';
import { Token } from '../orthography/token';

export type WordType = 'token' | 'reference' | 'elided';

export type Word = {
    type: WordType,
    token?: Token,
    elidedText?: string,
    elidedPosTag?: PosTag,
    startNode: number,
    endNode: number
}