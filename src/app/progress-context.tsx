import { createContext, useContext, useState, ReactNode } from 'react';

type ProgressContextType = {
    progress: boolean,
    showProgress: (progress: boolean) => void
}

const ProgressContext = createContext<ProgressContextType>({
    progress: false,
    showProgress: () => { },
});

export const useProgress = () => {
    return useContext(ProgressContext);
}

type Props = {
    children?: ReactNode
}

export const ProgressProvider = ({ children }: Props) => {
    const [progress, showProgress] = useState(false);

    return (
        <ProgressContext.Provider value={{ progress, showProgress }}>
            {children}
        </ProgressContext.Provider>
    )
}