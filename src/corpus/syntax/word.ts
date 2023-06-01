import { PosTag } from '../morphology/pos-tag';
import { Token } from '../orthography/token';

export type WordType = 'token' | 'reference' | 'hidden';

export type Word = {
    type: WordType,
    token?: Token,
    hiddenText?: string,
    hiddenPosTag?: PosTag,
    startNode: number,
    endNode: number
}