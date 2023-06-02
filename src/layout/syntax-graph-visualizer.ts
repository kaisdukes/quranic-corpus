import { RefObject } from 'react';
import { SyntaxGraph } from '../corpus/syntax/syntax-graph';
import { Position, Rect } from './geometry';
import { HeightMap } from './height-map';
import { Arc, Arrow, GraphLayout, Line } from './graph-layout';

export type WordElement = {
    ref: RefObject<HTMLDivElement>,
    posTagRefs: RefObject<HTMLDivElement>[]
}

export class SyntaxGraphVisualizer {
    private readonly heightMap = new HeightMap();
    private readonly nodePositions: Position[] = [];
    private readonly phrasePositions: Position[] = [];
    private phraseBounds: Rect[] = [];
    private lines: Line[] = [];

    constructor(
        private readonly syntaxGraph: SyntaxGraph,
        private readonly words: WordElement[],
        private readonly phrasesRef: RefObject<HTMLDivElement>[],
        private readonly labelRefs: RefObject<HTMLDivElement>[]) {
    }

    layoutSyntaxGraph(): GraphLayout {

        // measure words
        const wordGap = 40;
        const wordBounds = this.words.map(word => this.measureElement(word.ref));
        const containerWidth = wordBounds.reduce((width, rect) => width + rect.width, 0) + wordGap * (this.words.length - 1);
        const wordHeight = Math.max(...wordBounds.map(rect => rect.height));
        const segmentNodeY = wordHeight + 5;

        // layout words
        const wordPositions: Position[] = [];
        let x = containerWidth;
        for (let i = 0; i < this.words.length; i++) {
            const wordRect = wordBounds[i];
            x -= wordRect.width;
            wordPositions[i] = { x, y: 0 };

            // POS tags
            for (const posTag of this.words[i].posTagRefs) {
                const posTagBounds = this.measureElement(posTag);
                const cx = posTagBounds.x + 0.5 * posTagBounds.width - wordRect.x + x;
                this.nodePositions.push({ x: cx, y: segmentNodeY });
            }
            x -= wordGap;
        }
        this.heightMap.addSpan(0, containerWidth, segmentNodeY);

        // measure phrase nodes
        this.phraseBounds = this.phrasesRef.map(phrase => this.measureElement(phrase));

        // measure edge labels
        const labelBounds = this.labelRefs.map(label => this.measureElement(label));

        // For an explanation of the geometry of arc rendering in the Quranic Corpus, see
        // https://github.com/kaisdukes/quranic-corpus/blob/main/docs/arcs/arc-rendering.md
        const arcs: Arc[] = [];
        const arrows: Arrow[] = [];
        const labelPositions: Position[] = [];
        const { edges } = this.syntaxGraph;
        if (edges) {
            for (const edge of edges) {
                const { startNode, endNode, dependencyTag } = edge;

                // layout phrase nodes
                if (this.syntaxGraph.isPhraseNode(startNode)) {
                    this.layoutPhraseNode(startNode);
                }
                if (this.syntaxGraph.isPhraseNode(endNode)) {
                    this.layoutPhraseNode(endNode);
                }

                // node coordinates
                let x1: number, x2: number, y1: number, y2: number;
                const start = this.nodePositions[startNode];
                const end = this.nodePositions[endNode];
                const right = start.x < end.x;
                if (right) {
                    x1 = start.x;
                    y1 = start.y;
                    x2 = end.x;
                    y2 = end.y;
                } else {
                    x1 = end.x;
                    y1 = end.y;
                    x2 = start.x;
                    y2 = start.y;
                }

                // compute bounding box for arc between two nodes
                let y = y2;
                const deltaY = Math.abs(y2 - y1);
                const boxWidth = Math.abs(x2 - x1);

                // boost
                const maxY = this.heightMap.getHeight(x1 + 5, x2 - 5);
                let boxHeight = deltaY + 30;
                while (y + boxHeight < maxY) {
                    boxHeight += 50;
                }

                // compute ellipse radii so that arc touches the bounding max
                const ry = boxHeight;
                const theta = Math.asin(deltaY / ry);
                const rx = boxWidth / (1 + Math.cos(theta));

                const arc: Arc = {
                    x1,
                    y1,
                    x2,
                    y2,
                    dependencyTag,
                    rx,
                    ry,
                    xAxisRotation: 0,
                    largeArcFlag: 0,
                    sweepFlag: 0
                };
                arcs.push(arc);
                y += boxHeight;

                // arrow
                arrows.push({ x: x2 - rx - 3, y: y - 5, right });

                // layout edge label
                const { width: labelWidth, height: labelHeight } = labelBounds[labelPositions.length];
                y += 8;
                const labelPosition = {
                    x: x2 - rx - labelWidth * 0.5,
                    y
                };
                labelPositions.push(labelPosition)
                this.heightMap.addSpan(x1, x2, y + labelHeight);
            }
        }

        return {
            wordPositions,
            phrasePositions: this.phrasePositions,
            lines: this.lines,
            arcs,
            arrows,
            labelPositions,
            containerSize: {
                width: containerWidth,
                height: this.heightMap.height
            }
        }
    }

    private layoutPhraseNode(node: number) {

        // position
        const { startNode, endNode } = this.syntaxGraph.getPhraseNode(node);
        const x1 = this.nodePositions[endNode].x;
        const x2 = this.nodePositions[startNode].x;
        let y = this.heightMap.getHeight(x1, x2) + 25;
        const x = (x1 + x2) / 2;

        // line
        this.lines.push({ x1, y1: y, x2, y2: y });
        y += 10;

        // phrase
        const phraseIndex = node - this.syntaxGraph.segmentNodeCount;
        const phraseRect = this.phraseBounds[phraseIndex];
        const phraseX = x - phraseRect.width / 2;
        this.phrasePositions[phraseIndex] = { x: phraseX, y };

        // node
        y += phraseRect.height + 4;
        this.nodePositions[node] = { x, y };
        this.heightMap.addSpan(x1, x2, y);
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