import { createContext, useContext, useState, ReactNode } from 'react';

type OverlayContextType = {
    overlay: boolean,
    setOverlay: (overlay: boolean) => void
}

const OverlayContext = createContext<OverlayContextType>({
    overlay: false,
    setOverlay: () => { },
});

export const useOverlay = () => {
    return useContext(OverlayContext);
}

type Props = {
    children?: ReactNode
}

export const OverlayProvider = ({ children }: Props) => {
    const [overlay, setOverlay] = useState(true);

    return (
        <OverlayContext.Provider value={{ overlay, setOverlay }}>
            {children}
        </OverlayContext.Provider>
    )
}