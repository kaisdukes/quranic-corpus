export type Chapter = {
    chapterNumber: number,
    translation: string,
    phonetic: string
}

export const formatChapterTitle = (chapter: Chapter) => {
    const { phonetic, translation } = chapter;
    return translation ? `${phonetic} (${translation})` : phonetic;
}