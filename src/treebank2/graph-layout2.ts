import { Rect, Size } from '../layout/geometry';

export type WordLayout = {
    location: Rect,
    phonetic: Rect,
    translation: Rect,
    token: Rect,
    posTags: Rect[]
}

export type GraphLayout2 = {
    wordLayouts: WordLayout[],
    containerSize: Size
}