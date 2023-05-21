import { PosTag } from './pos-tag'
import { PronounType } from './pronoun-type'

export type Segment = {
    arabic?: string,
    posTag: PosTag,
    pronounType?: PronounType
}