import { DependencyTag } from '../corpus/syntax/dependency-tag';
import { Position, Size } from './geometry';

export type Line = {
    x1: number,
    y1: number,
    x2: number,
    y2: number
}

export type Arc = {
    x1: number,
    y1: number,
    x2: number,
    y2: number
    dependencyTag: DependencyTag,
    rx: number,
    ry: number,
    xAxisRotation: number,
    largeArcFlag: number,
    sweepFlag: number,
}

export type Arrow = {
    x: number,
    y: number,
    right: boolean
}

export type GraphLayout = {
    wordPositions: Position[],
    phrasePositions: Position[],
    lines: Line[],
    arcs: Arc[],
    arrows: Arrow[],
    labelPositions: Position[],
    containerSize: Size
}