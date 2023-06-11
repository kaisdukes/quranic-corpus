import { ApiBase } from './api-base';
import { Chapter } from '../corpus/orthography/chapter';
import { ChapterService } from '../corpus/orthography/chapter-service';
import { Translation } from '../corpus/translation/translation';
import { TranslationService } from '../corpus/translation/translation-service';
import { singleton } from 'tsyringe';
import axios from 'axios';

type Metadata = {
    chapters: Chapter[],
    translations: Translation[]
}

@singleton()
export class MetadataService extends ApiBase {

    constructor(
        private readonly chapterService: ChapterService,
        private readonly translationService: TranslationService) {
        super();
    }

    async cacheMetadata() {
        const response = await axios.get(this.url('/metadata'));
        const { chapters, translations } = response.data as Metadata;
        this.chapterService.chapters = chapters;
        this.translationService.translations = translations;
    }
}