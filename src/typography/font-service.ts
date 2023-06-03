import { singleton } from 'tsyringe';
import { CorpusError } from '../errors/corpus-error';
import { FontMetrics } from './font-metrics';

@singleton()
export class FontService {
    private readonly fontProperties = [
        '--default-font-family',
        '--default-arabic-font-family',
        '--verse-end-font-family',
        '--edge-label-font-family',
        '--hidden-word-font-family'
    ]

    private canvas: HTMLCanvasElement;
    private g: CanvasRenderingContext2D;
    private fontMetrics: Map<string, FontMetrics> = new Map();

    constructor() {
        this.canvas = document.createElement('canvas');
        const g = this.canvas.getContext('2d');
        if (!g) throw new CorpusError('SERVICE_ERROR', 'Failed to get canvas context.');
        this.g = g;
    }

    async loadFonts() {
        for (const property of this.fontProperties) {
            const font = getComputedStyle(document.documentElement).getPropertyValue(property);
            await this.loadFont(font);
            this.computeFontMetrics(font);
        }
    }

    getFontMetrics(font: string) {
        var metrics = this.fontMetrics.get(font);
        if (!metrics) {
            throw new CorpusError('SERVICE_ERROR', `Failed to get metrics for font ${font}`);
        }
        return metrics;
    }

    private async loadFont(font: string) {
        const style = `1em ${font}`;
        await document.fonts.load(style);
        const loaded = document.fonts.check(style);
        if (loaded) {
            console.log(`Loaded font ${font}`);
        } else {
            console.warn(`Failed to load font ${font}`);
        }
    }

    private computeFontMetrics(font: string) {
        const fontSize = 100;
        this.g.font = `${fontSize}px ${font}`;
        const textMetrics = this.g.measureText('abc');
        const fontMetrics = {
            ascenderHeight: textMetrics.fontBoundingBoxAscent / fontSize,
            descenderHeight: textMetrics.fontBoundingBoxDescent / fontSize
        }
        console.log(`Font ${font} has metrics ${JSON.stringify(fontMetrics)}`);
        this.fontMetrics.set(font, fontMetrics);
    }
}