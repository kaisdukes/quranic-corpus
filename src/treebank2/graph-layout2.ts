import { Rect, Size } from '../layout/geometry';

export type Circle = {
    cx: number,
    cy: number,
    r: number
}

export type WordLayout = {
    bounds: Rect,
    location: Rect,
    phonetic: Rect,
    translation: Rect,
    token: Rect,
    nodeCircles: Circle[],
    posTags: Rect[]
}

export type GraphLayout2 = {
    wordLayouts: WordLayout[],
    containerSize: Size
}