export abstract class ApiBase {
    private readonly baseUrl = 'https://qurancorpus.app/api';

    protected url = (relativePath: string) => this.baseUrl + relativePath;
}