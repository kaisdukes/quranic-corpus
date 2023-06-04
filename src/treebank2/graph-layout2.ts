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

export type Arc2 = {
    x1: number,
    y1: number,
    x2: number,
    y2: number
    rx: number,
    ry: number
}

export type GraphLayout2 = {
    wordLayouts: WordLayout[],
    edgeLabels: Rect[],
    arcs: Arc2[],
    containerSize: Size
}