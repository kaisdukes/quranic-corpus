import { singleton } from 'tsyringe';
import { Font } from './font';
import { FontMetrics } from './font-metrics';
import { CorpusError } from '../errors/corpus-error';
import { theme } from '../theme/theme';

@singleton()
export class FontService {
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
        for (const font of Object.values(theme.fonts)) {
            const { family: fontFamily } = font;
            await this.loadFont(fontFamily);
            this.computeFontMetrics(fontFamily);
        }
    }

    getFontMetrics(font: Font) {
        var metrics = this.fontMetrics.get(font.family);
        if (!metrics) {
            throw new CorpusError('SERVICE_ERROR', `Failed to get metrics for font ${font}`);
        }
        return metrics;
    }

    private async loadFont(fontFamily: string) {
        const style = `1em ${fontFamily}`;
        await document.fonts.load(style);
        const loaded = document.fonts.check(style);
        if (!loaded) {
            console.warn(`Failed to load font ${fontFamily}`);
        }
    }

    private computeFontMetrics(fontFamily: string) {
        const fontSize = 100;
        this.g.font = `${fontSize}px ${fontFamily}`;
        const textMetrics = this.g.measureText('abc');
        const fontMetrics = {
            ascenderHeight: textMetrics.fontBoundingBoxAscent / fontSize,
            descenderHeight: textMetrics.fontBoundingBoxDescent / fontSize
        }
        this.fontMetrics.set(fontFamily, fontMetrics);
    }
}