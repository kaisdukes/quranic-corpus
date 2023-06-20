import { RefObject } from 'react';
import { SyntaxGraph } from '../corpus/syntax/syntax-graph';
import { Word } from '../corpus/syntax/word';
import { Position, Rect } from '../layout/geometry';
import { HeightMap } from '../layout/height-map';
import { Arc, Arrow, GraphLayout, PhraseLayout, WordLayout } from './graph-layout';
import { SVGDom } from './svg-dom';
import { theme } from '../theme/theme';

export class SyntaxGraphVisualizer {
    private readonly heightMap = new HeightMap();
    private readonly nodePositions: Position[] = [];
    private readonly phraseLayouts: PhraseLayout[] = [];

    constructor(
        private readonly syntaxGraph: SyntaxGraph,
        private readonly svgDom: SVGDom) {
    }

    layoutGraph(): GraphLayout {
        const { words } = this.syntaxGraph;
        const {
            wordElements,
            phraseTagRefs,
            dependencyTagRefs
        } = this.svgDom;

        // measure words
        const wordLayouts: WordLayout[] = words.map((word, i) => {
            const wordElement = wordElements[i];
            const brackets = this.syntaxGraph.brackets(word);
            return {
                location: this.createBox(wordElement.locationRef),
                phonetic: this.createBox(wordElement.phoneticRef),
                translation: this.createBox(wordElement.translationRef),
                bra: brackets ? this.createBox(wordElement.braRef!) : undefined,
                token: this.createBox(wordElement.tokenRef),
                ket: brackets ? this.createBox(wordElement.ketRef!) : undefined,
                nodeCircles: [],
                posTags: wordElement.posTagRefs.map(this.createBox),
                bounds: { x: 0, y: 0, width: 0, height: 0 }
            }
        });

        // layout words
        for (let i = 0; i < words.length; i++) {
            this.layoutWord(words[i], wordLayouts[i]);
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
        const arcs: Arc[] = [];
        const arrows: Arrow[] = [];
        const { edges } = this.syntaxGraph;
        if (edges) {
            for (let i = 0; i < edges.length; i++) {
                const { startNode, endNode } = edges[i];

                // layout phrase nodes
                const start = this.nodePositions[startNode] ?? this.layoutPhrase(startNode);
                const end = this.nodePositions[endNode] ?? this.layoutPhrase(endNode);

                // node coordinates
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
                arrows.push({ x: maximaX - 3, y: y - 5, right });

                // layout edge label
                const edgeLabel = edgeLabels[i];
                y += 5;
                edgeLabel.x = maximaX - edgeLabel.width * 0.5;
                edgeLabel.y = y;
                this.heightMap.addSpan(x1, x2, y + edgeLabel.height);
            }
        }

        return {
            wordLayouts,
            phraseLayouts: this.phraseLayouts,
            edgeLabels,
            arcs,
            arrows,
            containerSize: {
                width: Math.ceil(containerWidth),
                height: Math.ceil(this.heightMap.height)
            }
        }
    }

    private layoutWord(word: Word, layout: WordLayout) {
        const { bounds, location, phonetic, translation, bra, token, ket, nodeCircles, posTags } = layout;
        const headerTextDeltaY = 23;
        const posTagGap = 25;
        const bracketDeltaY = 16;
        let y = 0;

        // measure
        const posTagWidth = this.getTotalWidth(posTags, posTagGap);
        const brackets = this.syntaxGraph.brackets(word);
        const tokenWidth = brackets ? bra!.width + token.width + ket!.width : token.width;
        const width = Math.max(
            location.width,
            phonetic.width,
            translation.width,
            tokenWidth,
            posTagWidth
        );

        // header
        this.centerHorizontal(location, width, y);
        y += headerTextDeltaY;
        this.centerHorizontal(phonetic, width, y);
        y += headerTextDeltaY;
        this.centerHorizontal(translation, width, y);
        y += headerTextDeltaY + 7;

        // token
        let x = (width + tokenWidth) / 2;
        if (brackets) {
            x -= ket!.width;
            ket!.x = x;
            ket!.y = y + bracketDeltaY;
        }
        x -= token.width;
        token.x = x;
        token.y = y;
        if (brackets) {
            x -= bra!.width;
            bra!.x = x;
            bra!.y = y + bracketDeltaY;
        }

        // ellision
        if (!word.token && !word.elidedText) {
            token.y += bracketDeltaY;
        }
        y += 65;

        // POS tags
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
        if (layout.bra) {
            layout.bra.x += x;
            layout.bra.y += y;
        }
        layout.token.x += x;
        layout.token.y += y;
        if (layout.ket) {
            layout.ket.x += x;
            layout.ket.y += y;
        }

        for (const nodeCircle of layout.nodeCircles) {
            nodeCircle.cx += x;
            nodeCircle.cy += y;
        }

        for (const posTag of layout.posTags) {
            posTag.x += x;
            posTag.y += y;
        }
    }

    private layoutPhrase(node: number): Position {

        // position
        const { startNode, endNode } = this.syntaxGraph.getPhraseNode(node);
        const x1 = this.nodePositions[endNode].x;
        const x2 = this.nodePositions[startNode].x;
        let y = this.heightMap.getHeight(x1, x2) + 20;
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
        const position = { x, y };
        this.nodePositions[node] = position;
        this.heightMap.addSpan(x1, x2, y);
        return position;
    }

    private getTotalWidth(elements: Rect[], gap: number): number {
        return elements.reduce((totalWidth, element) => totalWidth + element.width, 0)
            + gap * (elements.length - 1);
    }

    private centerHorizontal(element: Rect, width: number, y: number) {
        element.x = (width - element.width) / 2;
        element.y = y;
    }

    private createBox(ref: RefObject<SVGGraphicsElement>): Rect {
        const element = ref.current;
        const { x = 0, y = 0, width = 0, height = 0 } = element ? element.getBBox() : {};
        return { x, y, width, height };
    }
}