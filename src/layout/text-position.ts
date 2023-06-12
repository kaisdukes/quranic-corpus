import { Position, Rect } from '../layout/geometry';
import { FontMetrics } from '../typography/font-metrics';

export const getTextPosition = (
    box: Rect | undefined,
    fontMetrics: FontMetrics,
    fontSize: number,
    rtl?: boolean): Position | undefined => {

    if (!box) return undefined;

    const y = box.y + box.height - fontMetrics.descenderHeight * fontSize;
    return rtl ? { x: box.x + box.width, y } : { x: box.x, y }
}