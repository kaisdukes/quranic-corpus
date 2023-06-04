import { Position, Rect } from '../layout/geometry';
import { FontMetrics } from '../typography/font-metrics';

export const getTextPosition = (
    box: Rect | undefined,
    fontMetrics: FontMetrics,
    fontSize: number,
    rtl?: boolean,
    singleLineHeight?: boolean): Position | undefined => {

    if (!box) return undefined;
    return rtl ? {
        x: box.x + box.width,
        y: singleLineHeight
            ? box.y + box.height - fontMetrics.ascenderHeight * fontSize
            : box.y + box.height + (fontMetrics.descenderHeight - fontMetrics.ascenderHeight) * fontSize
    } : {
        x: box.x,
        y: box.y + box.height - fontMetrics.descenderHeight * fontSize
    }
}