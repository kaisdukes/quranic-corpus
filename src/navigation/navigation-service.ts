import { injectable } from 'tsyringe';

@injectable()
export class NavigationService {

    getChapterNumber(): number | null {
        const path = window.location.pathname;
        if (!path || path === '/') return null;

        const validPathPattern = /^\/\d+$/;
        if (!validPathPattern.test(path)) return null;

        return parseInt(path.slice(1));
    }
}