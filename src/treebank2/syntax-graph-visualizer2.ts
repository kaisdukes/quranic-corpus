import { RefObject } from 'react';
import { Rect } from '../layout/geometry';
import { SyntaxGraph } from '../corpus/syntax/syntax-graph';
import { SVGDom } from './svg-dom';
import { GraphLayout2, WordLayout } from './graph-layout2';

export class SyntaxGraphVisualizer2 {

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
            posTagRefs
        } = this.svgDom;
        const wordGap = 40;

        // measure
        const wordLayouts: WordLayout[] = words.map((word, i) => ({
            location: this.createBox(locationRefs[i]),
            phonetic: this.createBox(phoneticRefs[i]),
            translation: this.createBox(translationRefs[i]),
            token: this.createBox(tokenRefs[i]),
            posTags: posTagRefs.slice(word.startNode, word.endNode + 1).map(this.createBox),
            bounds: { x: 0, y: 0, width: 0, height: 0 }
        }));

        // layout words
        for (let layout of wordLayouts) {
            this.layoutWord(layout);
        }

        const wordWidths = wordLayouts.map(layout => layout.bounds.width);
        const containerWidth = wordWidths.reduce((width, wordWidth) => width + wordWidth, 0) + wordGap * (words.length - 1);
        const containerHeight = Math.max(...wordLayouts.map(layout => layout.bounds.height)) + 100;

        // position words
        let x = containerWidth;
        for (let layout of wordLayouts) {
            this.positionWord(layout, x, 0);
            x -= layout.bounds.width + wordGap;
        }

        return {
            wordLayouts,
            containerSize: {
                width: containerWidth,
                height: containerHeight
            }
        }
    }

    private layoutWord(layout: WordLayout) {
        const headerTextDeltaY = 25;
        const posTagGap = 10;
        let y = 0;
        let width = Math.max(
            layout.location.width,
            layout.phonetic.width,
            layout.translation.width,
            layout.token.width
        );
        let height = 0;

        // header
        this.centerHorizontal(layout.location, 0, y, width);
        y += headerTextDeltaY;
        this.centerHorizontal(layout.phonetic, 0, y, width);
        y += headerTextDeltaY;
        this.centerHorizontal(layout.translation, 0, y, width);
        y += headerTextDeltaY;
        this.centerHorizontal(layout.token, 0, y, width);
        y += headerTextDeltaY;
        height = y;

        // POS tags
        let posTagWidth = 0;
        for (const posTag of layout.posTags) {
            posTag.x = posTagWidth;
            posTag.y = y;
            posTagWidth += posTag.width + posTagGap;
        }
        y += Math.max(...layout.posTags.map(tag => tag.height));
        width = Math.max(width, posTagWidth - posTagGap);
        height = y;

        layout.bounds = { x: 0, y: 0, width, height };
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
        for (const posTag of layout.posTags) {
            posTag.x += x;
            posTag.y += y;
        }
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