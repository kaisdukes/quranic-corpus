import { ApiBase } from '../../api-base';
import { singleton } from 'tsyringe';
import axios from 'axios';
import { Chapter } from './chapter';

@singleton()
export class ChapterService extends ApiBase {
    private _chapters: Chapter[] | null = null;

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