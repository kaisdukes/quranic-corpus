import { Rect, Size } from '../layout/geometry';

export type Line2 = {
    x1: number,
    y1: number,
    x2: number,
    y2: number
}

export type Circle = {
    cx: number,
    cy: number,
    r: number
}

export type Arc2 = {
    x1: number,
    y1: number,
    x2: number,
    y2: number
    rx: number,
    ry: number
}

export type Arrow2 = {
    x: number,
    y: number,
    right: boolean
}

export type WordLayout = {
    bounds: Rect,
    location: Rect,
    phonetic: Rect,
    translation: Rect,
    bra?: Rect,
    token: Rect,
    ket?: Rect,
    nodeCircles: Circle[],
    posTags: Rect[]
}

export type PhraseLayout = {
    line: Line2,
    nodeCircle: Circle,
    phraseTag: Rect
}

export type GraphLayout2 = {
    wordLayouts: WordLayout[],
    phraseLayouts: PhraseLayout[],
    edgeLabels: Rect[],
    arcs: Arc2[],
    arrows: Arrow2[],
    containerSize: Size
}