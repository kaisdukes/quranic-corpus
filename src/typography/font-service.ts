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
            await this.loadFont(font);
            this.computeFontMetrics(font);
        }
    }

    getFontMetrics(font: Font) {
        var metrics = this.fontMetrics.get(font.family);
        if (!metrics) {
            throw new CorpusError('SERVICE_ERROR', `Failed to get metrics for font ${font}`);
        }
        return metrics;
    }

    private async loadFont(font: Font) {
        const { family } = font;
        const style = `1em ${family}`;
        await document.fonts.load(style);
        const loaded = document.fonts.check(style);
        if (!loaded) {
            console.warn(`Failed to load font ${family}`);
        }
    }

    private computeFontMetrics(font: Font) {
        const fontSize = 100;
        const { family } = font;
        this.g.font = `${fontSize}px ${family}`;
        const textMetrics = this.g.measureText('abc');
        const fontMetrics = { descenderHeight: textMetrics.fontBoundingBoxDescent / fontSize }
        this.fontMetrics.set(family, fontMetrics);
    }
}