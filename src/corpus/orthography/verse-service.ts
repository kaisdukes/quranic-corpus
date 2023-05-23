import { Verse } from './verse';
import { singleton } from 'tsyringe';

@singleton()
export class VerseService {

    getArabic(verse: Verse): string {
        let arabicVerse = '';
        verse.tokens.forEach(token => {
            if (arabicVerse.length > 0) {
                arabicVerse += ' ';
            }
            token.segments.forEach(segment => {
                if (segment.arabic) {
                    arabicVerse += segment.arabic;
                }
            });
        });
        return arabicVerse;
    }
}