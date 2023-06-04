import { Rect, Size } from '../layout/geometry';

export type GraphLayout2 = {
    locationBoxes: Rect[],
    phoneticBoxes: Rect[],
    translationBoxes: Rect[],
    tokenBoxes: Rect[],
    posTagBoxes: Rect[],
    containerSize: Size
}