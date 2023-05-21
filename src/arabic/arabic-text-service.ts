import { singleton } from 'tsyringe';

const fatha = '\u064E';
const waw = '\u0648';

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
        const i = text.length - 1;
        let ch = text.charAt(i);
        if (ch === fatha) {
            ch = text.charAt(i - 1);
        }
        return ch !== waw;
    }
}