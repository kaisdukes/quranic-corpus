import { ReactNode, forwardRef, Ref, RefObject } from 'react';
import './popup-menu.scss';

type Props = {
    ref: RefObject<HTMLDivElement | null>,
    showPopup: boolean,
    children: ReactNode
}

export const PopupMenu = forwardRef(({ showPopup, children }: Props, ref: Ref<HTMLDivElement>) => {
    return (
        <div ref={ref} className={`popup-menu ${showPopup ? 'visible' : ''}`}>
            {children}
        </div>
    )
})