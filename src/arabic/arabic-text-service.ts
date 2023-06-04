import { singleton } from 'tsyringe';

// characters
const hamza = 0x0621;
const alifWithHamzaAbove = 0x0623;
const alifWithHamzaBelow = 0x0625;
const wawWithHamzaAbove = 0x0624;
const alif = 0x0627;
const dal = 0x062f;
const thal = 0x0630;
const ra = 0x0631;
const zain = 0x0632;
const waw = 0x0648;

// diacritics
const fatha = 0x064E;
const damma = 0x064F;
const kasra = 0x0650;
const shadda = 0x0651;
const sukun = 0x0652;
const maddah = 0x0653;

const diacriticsSet = new Set([
    fatha,
    damma,
    kasra,
    shadda,
    sukun,
    maddah
]);

@singleton()
export class ArabicTextService {

    removeDiacritics(text: string) {
        let result = '';
        const n = text.length;
        for (let i = 0; i < n; i++) {
            const ch = text.charCodeAt(i)
            if (diacriticsSet.has(ch)) {
                continue;
            }
            if (ch === alifWithHamzaAbove || ch === alifWithHamzaBelow) {
                result += 'ا';
                continue;
            }
            result += text.charAt(i);
        }
        return result;
    }

    insertZeroWidthJoinersForSafari(segments: (string | undefined)[]) {
        let shouldJoin = false;
        const segmentCount = segments.length;
        for (let i = 0; i < segmentCount; i++) {
            const segment = segments[i];
            if (!segment) continue;

            // prefix
            let joinedSegment = segment;
            if (shouldJoin) {
                joinedSegment = '&zwj;' + joinedSegment;
            }

            // suffix
            const next = i < segmentCount - 1 ? segments[i + 1] : undefined;
            shouldJoin = next !== undefined && this.shouldJoinAfter(segment) && this.shouldJoinBefore(next);
            if (shouldJoin) {
                joinedSegment += '&zwj;';
            }
            segments[i] = joinedSegment;
        }
    }

    private shouldJoinAfter(text: string) {

        // skip diatirics
        const i = text.length - 1;
        let ch = text.charCodeAt(i);
        if (ch === fatha || ch === damma || ch === kasra || ch === sukun) {
            ch = text.charCodeAt(i - 1);
        }
        if (ch === shadda) {
            ch = text.charCodeAt(i - 2);
        }

        const nonJoiningLetter =
            ch === hamza
            || ch === alifWithHamzaAbove
            || ch === wawWithHamzaAbove
            || ch === alif
            || ch === dal
            || ch === thal
            || ch === ra
            || ch === zain
            || ch === waw;

        return !nonJoiningLetter;
    }

    private shouldJoinBefore(text: string) {
        return text.charCodeAt(0) !== hamza;
    }
}