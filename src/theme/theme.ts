import { Font } from '../typography/font';

interface ITheme {
    fonts: {
        [key: string]: Font
    },
    appHeaderHeight: string,
    arabicFontSizeSmall: string,
    arabicFontSizeMedium: string,
    arabicFontSizeLarge: string,
    syntaxGraphHeaderFontSize: number,
    syntaxGraphTokenFontSize: number,
    syntaxGraphElidedWordFontSize: number,
    syntaxGraphTagFontSize: number,
    syntaxGraphEdgeLabelFontSize: number,
    popupMenuHeight: string,
    tokenHeaderHeight: string
}

export const theme: ITheme = {
    fonts: {
        defaultFont: { family: 'Noto Sans' },
        defaultArabicFont: { family: 'Hafs' },
        verseEndFont: { family: 'Uthmani Hafs' },
        elidedWordFont: { family: 'Times New Roman' },
    },
    appHeaderHeight: '50px',
    arabicFontSizeSmall: '30px',
    arabicFontSizeMedium: '40px',
    arabicFontSizeLarge: '50px',
    syntaxGraphHeaderFontSize: 14,
    syntaxGraphTokenFontSize: 34,
    syntaxGraphElidedWordFontSize: 24,
    syntaxGraphTagFontSize: 18,
    syntaxGraphEdgeLabelFontSize: 16,
    popupMenuHeight: '250px',
    tokenHeaderHeight: '80px'
}

const setThemeProperty = (name: string, value: string | number) => {
    const kebabName = name.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    document.documentElement.style.setProperty(`--${kebabName}`, String(value));
}

export const applyStyles = (theme: ITheme) => {
    for (const [key, value] of Object.entries(theme)) {
        if (key === 'fonts') {
            for (const [fontKey, fontValue] of Object.entries(value)) {
                setThemeProperty(`${fontKey}-family`, (fontValue as Font).family);
            }
        } else {
            setThemeProperty(key, value);
        }
    }
}