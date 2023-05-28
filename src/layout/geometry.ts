import { CSSProperties } from 'react';

export type Position = {
    x: number,
    y: number
}

export type Size = {
    width: number,
    height: number
}

export type Rect = Position & Size;

export const positionElement = (position?: Position): CSSProperties => {
    return position
        ? {
            position: 'absolute',
            left: position.x,
            top: position.y
        }
        : {
            marginLeft: '-9999px' // Render off-screen initially
        }
}