export type ErrorCode = 'SERVICE_ERROR' | '404';

export class CorpusError extends Error {
    readonly code: ErrorCode;

    constructor(code: ErrorCode, message: string) {
        super(message);
        this.name = 'CorpusError';
        this.code = code;
    }
}