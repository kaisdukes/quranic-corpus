import { DependencyTag } from './dependency-tag'

export type Edge = {
    startNode: number,
    endNode: number,
    dependencyTag: DependencyTag
}