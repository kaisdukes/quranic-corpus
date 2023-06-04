import { RefObject } from 'react';
import { Rect, Size } from '../layout/geometry';
import { SyntaxGraph } from '../corpus/syntax/syntax-graph';
import { SVGDom } from './svg-dom';
import { GraphLayout2 } from './graph-layout2';

export type WordElement = {
    ref: RefObject<HTMLDivElement>,
    posTagRefs: RefObject<HTMLDivElement>[]
}

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
        const locationBoxes: Rect[] = [];
        const phoneticBoxes: Rect[] = [];
        const translationBoxes: Rect[] = [];
        const tokenBoxes: Rect[] = [];
        const posTagBoxes: Rect[] = [];
        const wordGap = 40;
        const headerTextDeltaY = 25;

        // measure
        const locationBounds = locationRefs.map(element => this.measureElement(element));
        const phoneticBounds = phoneticRefs.map(element => this.measureElement(element));
        const translationBounds = translationRefs.map(element => this.measureElement(element));
        const tokenBounds = tokenRefs.map(element => this.measureElement(element));
        const posTagBounds = posTagRefs.map(element => this.measureElement(element));
        const wordWidths = words.map((_, i) => Math.max(
            locationBounds[i].width,
            phoneticBounds[i].width,
            translationBounds[i].width,
            tokenBounds[i].width));
        const containerWidth = wordWidths.reduce((width, wordWidth) => width + wordWidth, 0) + wordGap * (words.length - 1);
        const tokenMaxY = headerTextDeltaY * 3 + Math.max(...tokenBounds.map(size => size.height));

        // layout words
        let x = containerWidth;
        for (let i = 0; i < words.length; i++) {
            const width = wordWidths[i];
            x -= width;
            let y = 0;
            locationBoxes.push(this.centerHorizontal(x, y, width, locationBounds[i]));
            y += headerTextDeltaY;
            phoneticBoxes.push(this.centerHorizontal(x, y, width, phoneticBounds[i]));
            y += headerTextDeltaY;
            translationBoxes.push(this.centerHorizontal(x, y, width, translationBounds[i]));
            y += headerTextDeltaY;
            tokenBoxes.push(this.centerHorizontal(x, y, width, tokenBounds[i]));
            x -= wordGap;
        }

        // layout POS tags
        x = containerWidth;
        for (const posTag of posTagBounds) {
            const width = posTag.width;
            x -= width;
            posTagBoxes.push({ x, y: 150, width, height: posTag.height });
            x -= 25;
        }

        return {
            locationBoxes,
            phoneticBoxes,
            translationBoxes,
            tokenBoxes,
            posTagBoxes,
            containerSize: {
                width: containerWidth,
                height: tokenMaxY + 50
            }
        }
    }

    private measureElement(element: RefObject<SVGGraphicsElement>): Size {
        return element.current
            ? element.current.getBBox()
            : {
                width: 0,
                height: 0
            }
    }

    private centerHorizontal(x: number, y: number, width: number, element: Size): Rect {
        return {
            x: x + (width - element.width) / 2,
            y, width: element.width, height: element.height
        }
    }
}