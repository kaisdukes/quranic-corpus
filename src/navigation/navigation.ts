import { Location } from 'react-router-dom';

export type NavigationProps = {
    chapterNumber: number
}

export const getPagePath = (location: Location) => {
    var pathname = location.pathname;
    var index = pathname.indexOf('/', 1);
    return pathname.substring(0, index);
}