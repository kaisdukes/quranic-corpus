type Span = {
    x1: number,
    x2: number
    height: number
}

export class HeightMap {
    private readonly spans: Span[] = [];

    addSpan(x1: number, x2: number, height: number) {
        this.spans.push({ x1, x2, height });
    }

    get height() {
        return this.spans.reduce((max, span) => Math.max(max, span.height), 0);
    }

    getHeight(x1: number, x2: number) {

		// soft boundary
		x1 += 5;
		x2 -= 5;

        let max = 0;
        for (const span of this.spans) {

            // Does the interval intersect this span?
            if (x1 <= span.x2 && x2 >= span.x1 && span.height > max) {
                max = span.height;
            }
        }
        return max;
    }
}