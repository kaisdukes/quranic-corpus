import { RefObject } from 'react';
import { DependencyGraph } from '../corpus/syntax/dependency-graph';
import { Position, Rect } from './geometry';
import { HeightMap } from './height-map';
import { Arc, GraphLayout, Line } from './graph-layout';

export type TokenDomElement = {
    ref: RefObject<HTMLDivElement>,
    posTagRefs: RefObject<HTMLDivElement>[]
}

export class DependencyGraphVisualizer {
    private readonly heightMap = new HeightMap();
    private readonly nodePositions: Position[] = [];
    private readonly phrasePositions: Position[] = [];
    private phraseBounds: Rect[] = [];
    private lines: Line[] = [];

    constructor(
        private readonly dependencyGraph: DependencyGraph,
        private readonly tokens: TokenDomElement[],
        private readonly phrasesRef: RefObject<HTMLDivElement>[],
        private readonly labelRefs: RefObject<HTMLDivElement>[]) {
    }

    layoutDependencyGraph(): GraphLayout {

        // measure tokens
        const tokenGap = 40;
        const tokenBounds = this.tokens.map(token => this.measureElement(token.ref));
        const containerWidth = tokenBounds.reduce((width, rect) => width + rect.width, 0) + tokenGap * (this.tokens.length - 1);
        const tokenHeight = Math.max(...tokenBounds.map(rect => rect.height));

        // layout tokens
        const tokenPositions: Position[] = [];
        let x = containerWidth;
        for (let i = 0; i < this.tokens.length; i++) {
            const tokenRect = tokenBounds[i];
            x -= tokenRect.width;
            tokenPositions[i] = { x, y: 0 };

            // POS tags
            for (const posTag of this.tokens[i].posTagRefs) {
                const posTagBounds = this.measureElement(posTag);
                const cx = posTagBounds.x + 0.5 * posTagBounds.width - tokenRect.x + x;
                this.nodePositions.push({ x: cx, y: tokenHeight + 5 });
            }
            x -= tokenGap;
        }
        this.heightMap.addSpan(0, containerWidth, tokenHeight + 5);

        // measure phrase nodes
        this.phraseBounds = this.phrasesRef.map(phrase => this.measureElement(phrase));

        // measure edge labels
        const labelBounds = this.labelRefs.map(label => this.measureElement(label));

        // For an explanation of the geometry of arc rendering in the Quranic Corpus, see
        // https://github.com/kaisdukes/quranic-corpus/blob/main/docs/arcs/arc-rendering.md
        const arcHeightStep = 30;
        const arcs: Arc[] = [];
        const labelPositions: Position[] = [];
        for (const edge of this.dependencyGraph.edges) {
            const { startNode, endNode, dependencyTag } = edge;
            if (this.dependencyGraph.isPhraseNode(startNode)) {
                this.layoutPhraseNode(startNode);
            }

            // compute bounding box for arc between two nodes
            const { x: x1, y: y1 } = this.nodePositions[startNode];
            const { x: x2, y: y2 } = this.nodePositions[endNode];
            const maxY = this.heightMap.getHeight(x1, x2) + arcHeightStep;
            const deltaY = Math.abs(y2 - y1);
            const boxWidth = Math.abs(x2 - x1);
            const boxHeight = Math.abs(maxY - y2);

            // compute ellipse radii so that arc touches the bounding max
            const ry = boxHeight;
            const theta = Math.asin(deltaY / ry);
            const rx = boxWidth / (1 + Math.cos(theta));

            const arc: Arc = {
                startNode,
                endNode,
                dependencyTag,
                rx,
                ry,
                xAxisRotation: 0,
                largeArcFlag: 0,
                sweepFlag: 0
            };
            arcs.push(arc);
            this.heightMap.addSpan(x1, x2, maxY);

            // layout edge label
            const { width: labelWidth, height: labelHeight } = labelBounds[labelPositions.length];
            const labelPosition = {
                x: x2 - rx - labelWidth * 0.5,
                y: maxY + 5
            };
            labelPositions.push(labelPosition)
            this.heightMap.addSpan(labelPosition.x, labelPosition.x + labelWidth, maxY + labelHeight + 5);
        }

        return {
            tokenPositions,
            nodePositions: this.nodePositions,
            phrasePositions: this.phrasePositions,
            lines: this.lines,
            arcs,
            labelPositions,
            containerSize: {
                width: containerWidth,
                height: this.heightMap.height
            }
        }
    }

    private layoutPhraseNode(node: number) {

        // position
        const { startNode, endNode } = this.dependencyGraph.getPhraseNode(node);
        const x1 = this.nodePositions[endNode].x;
        const x2 = this.nodePositions[startNode].x;
        let y = this.heightMap.getHeight(x1, x2) + 25;
        const x = (x1 + x2) / 2;

        // line
        this.lines.push({ x1, y1: y, x2, y2: y });
        y += 10;

        // phrase
        const phraseIndex = node - this.dependencyGraph.segmentNodeCount;
        const phraseRect = this.phraseBounds[phraseIndex];
        const phraseX = x - phraseRect.width / 2;
        this.phrasePositions[phraseIndex] = { x: phraseX, y };

        // node
        y += phraseRect.height + 5;
        this.nodePositions[node] = { x, y };
        this.heightMap.addSpan(phraseX, phraseX + phraseRect.width, y + phraseRect.height);
    }

    private measureElement(element: RefObject<HTMLElement>): Rect {
        return element.current
            ? element.current.getBoundingClientRect()
            : {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            };
    }
}