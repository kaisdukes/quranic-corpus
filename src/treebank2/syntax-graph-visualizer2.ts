import { RefObject } from 'react';
import { SyntaxGraph } from '../corpus/syntax/syntax-graph';
import { Position, Rect } from '../layout/geometry';
import { HeightMap } from '../layout/height-map';
import { Arc2, GraphLayout2, PhraseLayout, WordLayout } from './graph-layout2';
import { SVGDom } from './svg-dom';

export class SyntaxGraphVisualizer2 {
    private readonly heightMap = new HeightMap();
    private readonly nodePositions: Position[] = [];
    private readonly phraseLayouts: PhraseLayout[] = [];

    constructor(
        private readonly syntaxGraph: SyntaxGraph,
        private readonly svgDom: SVGDom) {
    }

    layoutGraph(): GraphLayout2 {
        const { words } = this.syntaxGraph;
        const {
            locationRefs,
            phoneticRefs,
            translationRefs,
            tokenRefs,
            posTagRefs,
            phraseTagRefs,
            dependencyTagRefs
        } = this.svgDom;

        // measure words
        const wordLayouts: WordLayout[] = words.map((word, i) => ({
            location: this.createBox(locationRefs[i]),
            phonetic: this.createBox(phoneticRefs[i]),
            translation: this.createBox(translationRefs[i]),
            token: this.createBox(tokenRefs[i]),
            nodeCircles: [],
            posTags: posTagRefs.slice(word.startNode, word.endNode + 1).map(this.createBox),
            bounds: { x: 0, y: 0, width: 0, height: 0 }
        }));

        // layout words
        for (const layout of wordLayouts) {
            this.layoutWord(layout);
        }

        const wordGap = 40;
        const containerWidth = this.getTotalWidth(wordLayouts.map(layout => layout.bounds), wordGap);
        const segmentNodeY = Math.max(...wordLayouts.map(layout => layout.bounds.height)) + 5;
        this.heightMap.addSpan(0, containerWidth, segmentNodeY);

        // position words
        let x = containerWidth;
        for (const layout of wordLayouts) {
            x -= layout.bounds.width;
            this.positionWord(layout, x, 0);
            x -= wordGap;

            for (const nodeCircle of layout.nodeCircles) {
                this.nodePositions.push({ x: nodeCircle.cx, y: segmentNodeY });
            }
        }

        // measure phrase tags
        for (const phraseTag of phraseTagRefs) {
            this.phraseLayouts.push({
                line: { x1: 0, y1: 0, x2: 0, y2: 0 },
                nodeCircle: { cx: 0, cy: 0, r: 0 },
                phraseTag: this.createBox(phraseTag),
            })
        }

        // measure edge labels
        const edgeLabels = dependencyTagRefs.map(this.createBox);

        // For an explanation of the geometry of arc rendering in the Quranic Corpus, see
        // https://github.com/kaisdukes/quranic-corpus/blob/main/docs/arcs/arc-rendering.md
        const arcs: Arc2[] = [];
        const { edges } = this.syntaxGraph;
        if (edges) {
            for (let i = 0; i < edges.length; i++) {
                const { startNode, endNode } = edges[i];

                // skip phrase nodes for now
                if (this.syntaxGraph.isPhraseNode(startNode)) {
                    this.layoutPhraseNode(startNode);
                }
                if (this.syntaxGraph.isPhraseNode(endNode)) {
                    this.layoutPhraseNode(endNode);
                }

                // node coordinates
                const start = this.nodePositions[startNode];
                const end = this.nodePositions[endNode];
                const right = start.x < end.x;
                const { x: x1, y: y1 } = right ? start : end;
                const { x: x2, y: y2 } = right ? end : start;

                // compute bounding box for arc between two nodes
                const boxWidth = x2 - x1;
                let y = Math.min(y1, y2);
                const deltaY = Math.abs(y2 - y1);

                // boost
                const maxY = this.heightMap.getHeight(x1 + 5, x2 - 5);
                let boxHeight = deltaY + 30;
                while (y + boxHeight < maxY) {
                    boxHeight += 50;
                }

                // compute ellipse radii so the arc touches the bounding box
                const ry = boxHeight;
                const theta = Math.asin(deltaY / ry);
                const rx = boxWidth / (1 + Math.cos(theta));
                arcs.push({ x1, y1, x2, y2, rx, ry });
                y += boxHeight;

                const maximaX = y2 > y1 ? x1 + rx : x2 - rx;

                // layout edge label
                const edgeLabel = edgeLabels[i];
                y += 8;
                edgeLabel.x = maximaX - edgeLabel.width * 0.5;
                edgeLabel.y = y;
                this.heightMap.addSpan(x1, x2, y + 18);
            }
        }

        return {
            wordLayouts,
            phraseLayouts: this.phraseLayouts,
            edgeLabels,
            arcs,
            containerSize: {
                width: containerWidth,
                height: this.heightMap.height
            }
        }
    }

    private layoutWord(layout: WordLayout) {
        const { bounds, location, phonetic, translation, token, nodeCircles, posTags } = layout;
        const headerTextDeltaY = 23;
        const posTagGap = 25;
        let y = 0;

        // measure
        const posTagWidth = this.getTotalWidth(posTags, posTagGap);

        let width = Math.max(
            location.width,
            phonetic.width,
            translation.width,
            token.width,
            posTagWidth
        );

        // layout header
        this.centerHorizontal(location, 0, y, width);
        y += headerTextDeltaY;
        this.centerHorizontal(phonetic, 0, y, width);
        y += headerTextDeltaY;
        this.centerHorizontal(translation, 0, y, width);
        y += headerTextDeltaY + 7;
        this.centerHorizontal(token, 0, y, width);
        y += token.height + 5;

        // layout POS tags
        let tagX = (width + posTagWidth) / 2;
        const r = 3;
        for (const posTag of posTags) {
            tagX -= posTag.width;
            nodeCircles.push({ cx: tagX + posTag.width / 2, cy: y, r })
            posTag.x = tagX;
            posTag.y = y + 10;
            tagX -= posTagGap;
        }

        bounds.width = width;
        bounds.height = Math.max(...posTags.map(tag => tag.y + tag.height));
    }

    private positionWord(layout: WordLayout, x: number, y: number) {
        layout.bounds.x = x;
        layout.bounds.y = y;
        layout.location.x += x;
        layout.location.y += y;
        layout.phonetic.x += x;
        layout.phonetic.y += y;
        layout.translation.x += x;
        layout.translation.y += y;
        layout.token.x += x;
        layout.token.y += y;

        for (const nodeCircle of layout.nodeCircles) {
            nodeCircle.cx += x;
            nodeCircle.cy += y;
        }

        for (const posTag of layout.posTags) {
            posTag.x += x;
            posTag.y += y;
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
        const phraseIndex = node - this.syntaxGraph.segmentNodeCount;
        const layout = this.phraseLayouts[phraseIndex];
        layout.line = { x1, y1: y, x2, y2: y };
        y += 13;

        // node
        layout.nodeCircle = { cx: x, cy: y, r: 3 }
        y += 10;

        // phrase
        const phraseTag = layout.phraseTag;
        phraseTag.x = x - phraseTag.width / 2;
        phraseTag.y = y;

        // node
        y += phraseTag.height + 4;
        this.nodePositions[node] = { x, y };
        this.heightMap.addSpan(x1, x2, y);
    }

    private getTotalWidth(elements: Rect[], gap: number): number {
        return elements.reduce((totalWidth, element) => totalWidth + element.width, 0)
            + gap * (elements.length - 1);
    }

    private centerHorizontal(element: Rect, x: number, y: number, width: number) {
        element.x = x + (width - element.width) / 2;
        element.y = y;
    }

    private createBox(ref: RefObject<SVGGraphicsElement>): Rect {
        const element = ref.current;
        const { x = 0, y = 0, width = 0, height = 0 } = element ? element.getBBox() : {};
        return { x, y, width, height };
    }
}