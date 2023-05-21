import { singleton } from 'tsyringe';

// characters
const hamza = '\u0621';
const alifWithHamzaAbove = '\u0623';
const dal = '\u062f';
const thal = '\u0630';
const ra = '\u0631';
const zain = '\u0632'
const waw = '\u0648';

// diacritics
const fatha = '\u064E';
const damma = '\u064F';
const shadda = '\u0651';

@singleton()
export class ArabicTextService {

    insertZeroWidthJoinersForSafari(segments: string[]) {
        let shouldJoin = false;
        const segmentCount = segments.length;
        for (let i = 0; i < segmentCount; i++) {
            const segment = segments[i];

            // prefix
            let joinedSegment = segment;
            if (shouldJoin) {
                joinedSegment = '&zwj;' + joinedSegment;
            }

            // suffix
            if (shouldJoin = i < segmentCount - 1 && this.shouldJoinAfter(segment)) {
                joinedSegment += '&zwj;'
            }
            segments[i] = joinedSegment;
        }
    }

    private shouldJoinAfter(text: string) {

        // skip diatirics
        const i = text.length - 1;
        let ch = text.charAt(i);
        if (ch === fatha || ch === damma) {
            ch = text.charAt(i - 1);
        }
        if (ch === shadda) {
            ch = text.charAt(i - 2);
        }

        const nonJoiningLetter =
            ch === hamza
            || ch === alifWithHamzaAbove
            || ch === dal
            || ch === thal
            || ch === ra
            || ch === zain
            || ch === waw;

        return !nonJoiningLetter;
    }
}