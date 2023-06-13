import { Span, SpanType } from './span';

export class MarkupParser {
    private markup: string;
    private spans: Span[] = [];
    private position = 0;

    constructor(markup: string) {
        this.markup = markup;
    }

    public parse(): Span[] {
        while (this.canRead()) {
            this.spans.push(this.read());
        }
        return this.spans;
    }

    private read(): Span {
        switch (this.peek()) {
            case '{': return this.readSpan('phonetic');
            case '[': return this.readSpan('arabic');
            default: return this.readText();
        }
    }

    private readText(): Span {
        const start = this.position;
        while (this.canRead() && this.peek() !== '{' && this.peek() !== '[') {
            this.position++;
        }
        return { type: 'text', text: this.markup.substring(start, this.position) };
    }

    private readSpan(spanType: SpanType): Span {
        const start = ++this.position;
        const endChar = spanType === 'phonetic' ? '}' : ']';
        while (this.markup.charAt(this.position) !== endChar) {
            this.position++;
        }
        return { type: spanType, text: this.markup.substring(start, this.position++) };
    }

    private canRead(): boolean {
        return this.position < this.markup.length;
    }

    private peek(): string {
        return this.markup.charAt(this.position);
    }
}
