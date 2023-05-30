import { ReactNode, MutableRefObject, forwardRef, Ref } from 'react';
import './popup-menu.scss';

type Props = {
    ref: MutableRefObject<HTMLDivElement | null>,
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