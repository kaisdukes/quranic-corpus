import { ApiBase } from '../../api-base';
import { singleton } from 'tsyringe';
import { Chapter } from './chapter';
import { CorpusError } from '../../errors/corpus-error';
import axios from 'axios';

@singleton()
export class ChapterService extends ApiBase {
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

    async cacheChapters() {
        const response = await axios.get(this.url('/chapter'));
        this._chapters = response.data;
    }
}