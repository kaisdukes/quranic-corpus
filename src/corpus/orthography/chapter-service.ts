import { Chapter } from './chapter';
import { CorpusError } from '../../errors/corpus-error';
import { singleton } from 'tsyringe';

@singleton()
export class ChapterService {
    private _chapters: Chapter[] | null = null;

    getChapter(chapterNumber: number): Chapter {
        return this.chapters[chapterNumber - 1];
    }

    get chapters(): Chapter[] {
        if (!this._chapters) {
            throw new CorpusError('SERVICE_ERROR', 'Chapters not loaded.');
        }
        return this._chapters;
    }

    set chapters(chapters: Chapter[]) {
        this._chapters = chapters;
    }
}