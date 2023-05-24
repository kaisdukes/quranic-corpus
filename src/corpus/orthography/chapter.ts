export type Chapter = {
    chapterNumber: number,
    verseCount: number,
    translation: string,
    phonetic: string,
    city: string
}

export const formatChapterTitle = (chapter: Chapter) => {
    const { phonetic, translation } = chapter;
    return translation ? `${phonetic} (${translation})` : phonetic;
}