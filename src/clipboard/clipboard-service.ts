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

        let plainTextContent = '';
        let htmlContent = '';

        const addContent = (text: string, isLink: boolean = false, newLine: boolean = true) => {
            plainTextContent += text + '\n';
            htmlContent += isLink ? `<a href='${text}'>${text}</a>` : `${text}`;
            if (newLine) {
                htmlContent += '<br>';
            }
        }

        addContent(`${chapter.phonetic} ${formatLocationWithBrackets(location)}`);
        addContent('');
        addContent(`${arabic}`);
        addContent('');
        addContent(`${verse.translation} -`);
        addContent('');
        addContent('---');
        addContent('From the Quranic Arabic Corpus: ', false, false);
        addContent(`https://qurancorpus.app/${chapterNumber}`, true);

        await navigator.clipboard.write([
            new ClipboardItem({
                'text/plain': new Blob([plainTextContent], { type: 'text/plain' }),
                'text/html': new Blob([htmlContent], { type: 'text/html' })
            })
        ]);
    }
}