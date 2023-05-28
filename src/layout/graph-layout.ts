import { DependencyTag } from '../corpus/syntax/dependency-tag'
import { Position, Size } from './geometry'

export type Arc = {
    startNode: number,
    endNode: number,
    dependencyTag: DependencyTag,
    rx: number,
    ry: number,
    xAxisRotation: number,
    largeArcFlag: number,
    sweepFlag: number
}

export type GraphLayout = {
    tokenPositions: Position[],
    nodePositions?: Position[],
    arcs?: Arc[],
    labelPositions: Position[],
    containerSize: Size
}