export type Span = {
    type: SpanType,
    text: string
}

export type SpanType = 'text' | 'arabic' | 'phonetic';