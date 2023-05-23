import { ApiBase } from '../../api-base';
import { VerseService } from './verse-service';
import { singleton } from 'tsyringe';
import { Chapter } from './chapter';
import { Verse } from './verse';
import { formatLocationWithBrackets } from '../location';
import axios from 'axios';

@singleton()
export class ChapterService extends ApiBase {
    private _chapters: Chapter[] | null = null;

    constructor(private readonly verseService: VerseService) {
        super();
    }

    copyVerse(verse: Verse) {
        const { location } = verse;
        const chapterNumber = location[1];
        const chapter = this.getChapter(chapterNumber);
        const arabic: string = this.verseService.getArabic(verse);

        const lines: string[] = [];

        lines.push(`${chapter.phonetic} ${formatLocationWithBrackets(location)}`);
        lines.push('');
        lines.push(`${arabic}`);
        lines.push('');
        lines.push(`${verse.translation} -`);
        lines.push('');
        lines.push('---');
        lines.push(`From the Quranic Arabic Corpus: https://qurancorpus.app/${chapterNumber}`);

        return lines.join('\n');
    }

    getChapter(chapterNumber: number): Chapter {
        return this.chapters[chapterNumber - 1];
    }

    get chapters(): Chapter[] {
        if (!this._chapters) {
            throw new Error('Chapters not loaded.');
        }
        return this._chapters;
    }

    async cacheChapters() {
        const response = await axios.get(this.url('/chapter'));
        this._chapters = response.data;
    }
}