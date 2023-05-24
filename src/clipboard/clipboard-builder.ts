export class ClipboardBuilder {
    private plainTextContent = '';
    private htmlContent = '';

    add(text: string) {
        this.plainTextContent += text;
        this.htmlContent += text;
        return this;
    }

    link(url: string) {
        this.plainTextContent += url;
        this.htmlContent += `<a href='${url}'>${url}</a>`;
        return this;
    }

    newLine() {
        this.plainTextContent += '\n';
        this.htmlContent += '<br>';
        return this;
    }

    build() {
        return [
            new ClipboardItem({
                'text/plain': new Blob([this.plainTextContent], { type: 'text/plain' }),
                'text/html': new Blob([this.htmlContent], { type: 'text/html' }),
            })
        ]
    }
}