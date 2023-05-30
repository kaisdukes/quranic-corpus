import { singleton } from 'tsyringe';
import { formatLocationWithBrackets } from '../corpus/location';
import { ChapterService } from '../corpus/orthography/chapter-service';
import { VerseService } from '../corpus/orthography/verse-service';
import { Verse } from '../corpus/orthography/verse';
import { ClipboardBuilder } from './clipboard-builder';

@singleton()
export class ClipboardService {

    constructor(
        private readonly chapterService: ChapterService,
        private readonly verseService: VerseService) {
    }

    async copyVerse(verse: Verse) {
        const { location, translations } = verse;
        const [chapterNumber] = location;
        const chapter = this.chapterService.getChapter(chapterNumber);

        const content = new ClipboardBuilder();
        content
            .add(`${chapter.phonetic} ${formatLocationWithBrackets(location)}`).newLine()
            .newLine()
            .add(this.verseService.getArabic(verse)).newLine()
            .newLine()
            .add(translations[0].translation).newLine()
            .newLine()
            .add('---').newLine()
            .add('From the Quranic Arabic Corpus: ').link(`https://qurancorpus.app/${chapterNumber}`);

        await navigator.clipboard.write(content.build());
    }
}