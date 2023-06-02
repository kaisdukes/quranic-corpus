import { singleton } from 'tsyringe';

@singleton()
export class FontService {
    private readonly fontProperties = [
        '--default-font-family',
        '--default-arabic-font-family',
        '--verse-end-font-family',
        '--edge-label-font-family',
        '--hidden-word-font-family'
    ]

    async loadFonts() {
        for (const property of this.fontProperties) {
            await this.loadFont(property);
        }
    }

    private async loadFont(property: string) {
        const font = getComputedStyle(document.documentElement).getPropertyValue(property);
        const style = `1em ${font}`;
        await document.fonts.load(style);
        const loaded = document.fonts.check(style);
        if (loaded) {
            console.log(`Loaded font ${font}`);
        } else {
            console.warn(`Failed to load font ${font}`);
        }
    }
}