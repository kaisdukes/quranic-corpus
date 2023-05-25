import { createContext, useContext, useState, ReactNode } from 'react';

export type ReaderOptions = {
    readerMode: boolean
}

type ReaderSettingsContextType = {
    readerSettings: ReaderOptions,
    setReaderSettings: (readerOptions: ReaderOptions) => void
}

const defaultReaderSettings: ReaderOptions = { readerMode: false };

const ReaderSettingsContext = createContext<ReaderSettingsContextType>({
    readerSettings: defaultReaderSettings,
    setReaderSettings: () => { },
});

export const useReaderSettings = () => {
    return useContext(ReaderSettingsContext);
}

type Props = {
    children?: ReactNode
}

export const ReaderSettingsProvider = ({ children }: Props) => {
    const [readerSettings, setReaderSettings] = useState(defaultReaderSettings);

    return (
        <ReaderSettingsContext.Provider value={{ readerSettings, setReaderSettings }}>
            {children}
        </ReaderSettingsContext.Provider>
    )
}