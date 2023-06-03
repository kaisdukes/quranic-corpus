import { Font } from '../typography/font';

interface ITheme {
    fonts: {
        [key: string]: Font
    },
    arabicFontSizeLarge: string,
    arabicFontSizeMedium: string,
    syntaxGraphHeaderFontSize: number,
    syntaxGraphArabicFontSize: number,
    popupMenuHeight: string,
    tokenHeaderHeight: string

}

export const theme: ITheme = {
    fonts: {
        defaultFont: { family: 'Noto Sans' },
        defaultArabicFont: { family: 'Hafs', rtl: true },
        verseEndFont: { family: 'Uthmani Hafs', rtl: true },
        edgeLabelFont: { family: 'Traditional Arabic', rtl: true },
        hiddenWordFont: { family: 'Times New Roman' },
    },
    arabicFontSizeLarge: '50px',
    arabicFontSizeMedium: '30px',
    syntaxGraphHeaderFontSize: 14,
    syntaxGraphArabicFontSize: 34,
    popupMenuHeight: '250px',
    tokenHeaderHeight: '80px'
}

const setThemeProperty = (name: string, value: string | number) => {
    const kebabName = name.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    document.documentElement.style.setProperty(`--${kebabName}`, String(value));
}

export const applyStyles = (theme: ITheme) => {
    for (let [key, value] of Object.entries(theme)) {
        if (key === 'fonts') {
            for (let [fontKey, fontValue] of Object.entries(value)) {
                setThemeProperty(`${fontKey}-family`, (fontValue as Font).family);
            }
        } else {
            setThemeProperty(key, value);
        }
    }
}