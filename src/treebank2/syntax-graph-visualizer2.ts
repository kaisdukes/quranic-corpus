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
        const headerTextDeltaY = 25;

        // measure
        const wordLayouts: WordLayout[] = words.map((word, i) => ({
            location: this.createBox(locationRefs[i]),
            phonetic: this.createBox(phoneticRefs[i]),
            translation: this.createBox(translationRefs[i]),
            token: this.createBox(tokenRefs[i]),
            posTags: posTagRefs.slice(word.startNode, word.endNode + 1).map(this.createBox)
        }));

        const wordWidths = wordLayouts.map((layout) => Math.max(
            layout.location.width,
            layout.phonetic.width,
            layout.translation.width,
            layout.token.width
        ));

        const containerWidth = wordWidths.reduce((width, wordWidth) => width + wordWidth, 0) + wordGap * (words.length - 1);
        const tokenMaxY = headerTextDeltaY * 3 + Math.max(...wordLayouts.map(layout => layout.token.height));

        // layout words
        let x = containerWidth;
        for (const layout of wordLayouts) {
            const width = Math.max(
                layout.location.width,
                layout.phonetic.width,
                layout.translation.width,
                layout.token.width
            );
            x -= width;
            let y = 0;
            this.centerHorizontal(layout.location, x, y, width);
            y += headerTextDeltaY;
            this.centerHorizontal(layout.phonetic, x, y, width);
            y += headerTextDeltaY;
            this.centerHorizontal(layout.translation, x, y, width);
            y += headerTextDeltaY;
            this.centerHorizontal(layout.token, x, y, width);
            x -= wordGap;
        }

        // layout POS tags
        x = containerWidth;
        for (const layout of wordLayouts) {
            for (const posTag of layout.posTags) {
                const width = posTag.width;
                x -= width;
                posTag.x = x;
                posTag.y = 150;
                x -= 25;
            }
        }

        return {
            wordLayouts,
            containerSize: {
                width: containerWidth,
                height: tokenMaxY + 50
            }
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