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
        for (const layout of wordLayouts) {
            this.layoutWord(layout);
        }

        const containerWidth = this.measureWidth(wordLayouts.map(layout => layout.bounds), wordGap);
        const containerHeight = Math.max(...wordLayouts.map(layout => layout.bounds.height));

        // position words
        let x = containerWidth;
        for (const layout of wordLayouts) {
            x -= layout.bounds.width;
            this.positionWord(layout, x, 0);
            x -= wordGap;
        }

        return {
            wordLayouts,
            containerSize: {
                width: containerWidth,
                height: containerHeight
            }
        }
    }

    private layoutWord(_layout: WordLayout) {
        const { bounds, location, phonetic, translation, token, posTags } = _layout;
        const headerTextDeltaY = 25;
        const posTagGap = 25;
        let y = 0;

        // measure
        const posTagWidth = this.measureWidth(posTags, posTagGap);

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
        y += headerTextDeltaY;
        this.centerHorizontal(token, 0, y, width);
        y += token.height + 5;

        // layout POS tags
        let x = (width + posTagWidth) / 2;
        for (const posTag of posTags) {
            x -= posTag.width;
            posTag.x = x;
            posTag.y = y;
            x -= posTagGap;
        }

        y += Math.max(...posTags.map(tag => tag.height));
        bounds.width = width;
        bounds.height = y;
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

    private measureWidth(elements: Rect[], gap: number): number {
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