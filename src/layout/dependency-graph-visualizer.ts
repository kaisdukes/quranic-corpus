import { RefObject } from 'react';
import { DependencyGraph } from '../corpus/syntax/dependency-graph';
import { DependencyTag } from '../corpus/syntax/dependency-tag';
import { Position, Rect } from './geometry';
import { HeightMap } from './height-map';

export type TokenDomElement = {
    ref: RefObject<HTMLDivElement>,
    segmentCircleRefs: RefObject<HTMLDivElement>[]
}

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

export class DependencyGraphVisualizer {
    private readonly heightMap = new HeightMap();
    private readonly nodePositions: Position[] = [];

    constructor(
        private readonly dependencyGraph: DependencyGraph,
        private readonly tokens: TokenDomElement[]) {
    }

    layoutDependencyGraph() {

        // measure tokens
        const tokenBoundsList = this.measureTokens();
        const tokenGap = 40;
        const containerWidth = tokenBoundsList.reduce((width, rect) => width + rect.width, 0) + tokenGap * (this.tokens.length - 1);
        const tokenHeight = Math.max(...tokenBoundsList.map(rect => rect.height));

        // layout tokens
        const tokenPositions: Position[] = [];
        let x = containerWidth;
        for (let i = 0; i < this.tokens.length; i++) {
            const token = this.tokens[i];
            const arabicToken = token.ref.current;
            if (!arabicToken) {
                continue;
            }
            const tokenBounds = arabicToken.getBoundingClientRect();
            x -= tokenBounds.width;
            tokenPositions[i] = { x, y: 0 };

            // segment circles
            for (const segmentCircleRef of token.segmentCircleRefs) {
                const circleElement = segmentCircleRef.current;
                if (circleElement) {
                    const circleBounds = circleElement.getBoundingClientRect();
                    const cx = circleBounds.x + 0.5 * circleBounds.width - tokenBounds.x + x;
                    this.nodePositions.push({ x: cx, y: tokenHeight + 5 });
                }
            }

            x -= tokenGap;
        }
        this.heightMap.addSpan(0, containerWidth, tokenHeight + 5);

        // create arcs from edges
        const arcHeight = 40;
        const arcs: Arc[] = [];
        for (const edge of this.dependencyGraph.edges) {
            const { startNode, endNode, dependencyTag } = edge;
            if (this.dependencyGraph.isPhraseNode(startNode)) {
                this.layoutPhraseNode(startNode);
            }
            const { x: x1, y: y1 } = this.nodePositions[startNode];
            const { x: x2, y: y2 } = this.nodePositions[endNode];
            const height = this.heightMap.getHeight(x1, x2) + arcHeight;
            const arc: Arc = {
                startNode,
                endNode,
                dependencyTag,
                rx: Math.abs(x2 - x1) / 2,
                ry: height - y1,
                xAxisRotation: 0,
                largeArcFlag: 0,
                sweepFlag: 0
            };
            arcs.push(arc);
            this.heightMap.addSpan(x1, x2, height);
        }

        return {
            tokenPositions,
            nodePositions: this.nodePositions,
            arcs,
            containerSize: {
                width: containerWidth,
                height: this.heightMap.height
            }
        }
    }

    private layoutPhraseNode(node: number) {
        const { startNode, endNode } = this.dependencyGraph.getPhraseNode(node);
        const x1 = this.nodePositions[endNode].x;
        const x2 = this.nodePositions[startNode].x;
        const y = this.heightMap.getHeight(x1, x2) + 20;
        const x = (x1 + x2) / 2;
        this.nodePositions[node] = { x, y };
    }

    private measureTokens(): Rect[] {
        return this.tokens.map(token => token.ref.current
            ? token.ref.current.getBoundingClientRect()
            : { x: 0, y: 0, width: 0, height: 0 }
        )
    }
}