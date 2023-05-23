import { singleton } from 'tsyringe';
import { formatLocationWithBrackets } from '../corpus/location';
import { ChapterService } from '../corpus/orthography/chapter-service';
import { VerseService } from '../corpus/orthography/verse-service';
import { Verse } from '../corpus/orthography/verse';

@singleton()
export class ClipboardService {

    constructor(
        private readonly chapterService: ChapterService,
        private readonly verseService: VerseService) {
    }

    async copyVerse(verse: Verse) {
        const { location } = verse;
        const chapterNumber = location[1];
        const chapter = this.chapterService.getChapter(chapterNumber);
        const arabic: string = this.verseService.getArabic(verse);

        const lines: string[] = [];
        const htmlLines: string[] = [];

        const addLine = (text: string, isLink: boolean = false) => {
            lines.push(text);
            htmlLines.push(isLink ? `<a href='${text}'>${text}</a><br>` : `${text}<br>`);
        };

        addLine(`${chapter.phonetic} ${formatLocationWithBrackets(location)}`);
        addLine('');
        addLine(`${arabic}`);
        addLine('');
        addLine(`${verse.translation} -`);
        addLine('');
        addLine('---');
        addLine(`From the Quranic Arabic Corpus: https://qurancorpus.app/${chapterNumber}`, true);

        const plainTextContent = lines.join('\n');
        const htmlContent = htmlLines.join('');

        await navigator.clipboard.write([
            new ClipboardItem({
                'text/plain': new Blob([plainTextContent], { type: 'text/plain' }),
                'text/html': new Blob([htmlContent], { type: 'text/html' })
            })
        ]);
    }
}