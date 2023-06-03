import { singleton } from 'tsyringe';
import { CorpusError } from '../errors/corpus-error';

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
    private descenderHeights: Map<string, number> = new Map();

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
            this.computeDescenderHeight(font);
        }
    }

    getDescenderHeight(font: string) {
        var descenderHeight = this.descenderHeights.get(font);
        if (!descenderHeight) {
            throw new CorpusError('SERVICE_ERROR', `Failed to get descender height for font ${font}`);
        }
        return descenderHeight;
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

    private computeDescenderHeight(font: string) {
        const fontSize = 100;
        this.g.font = `${fontSize}px ${font}`;
        const metrics = this.g.measureText('gjpqy');
        const descenderSizeInPixels = metrics.actualBoundingBoxDescent;
        const descenderHeight = descenderSizeInPixels / fontSize;
        console.log(`Font ${font} has descender height ${descenderHeight}`);
        this.descenderHeights.set(font, descenderHeight);
    }
}