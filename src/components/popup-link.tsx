import { useRef, useEffect, ReactNode, RefObject } from 'react';

type Props = {
    className: string,
    children: ReactNode,
    popupRef: RefObject<HTMLDivElement | null>,
    showPopup: boolean,
    onShowPopup: (showPopup: boolean) => void
}

export const PopupLink = ({ className, children, popupRef, showPopup, onShowPopup }: Props) => {
    const linkRef = useRef<HTMLAnchorElement | null>(null);

    const isChildOfLink = (element: Node): boolean => {
        if (element === linkRef.current) {
            return true;
        }
        if (!element.parentElement) {
            return false;
        }
        return isChildOfLink(element.parentElement);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const targetElement = event.target as Node;

            if (popupRef.current
                && !popupRef.current.contains(targetElement)
                && !isChildOfLink(targetElement)) {
                onShowPopup(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const togglePopup = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        onShowPopup(!showPopup);
    }

    return (
        <a ref={linkRef} className={className} href='#' onClick={togglePopup}>
            {children}
        </a>
    )
}