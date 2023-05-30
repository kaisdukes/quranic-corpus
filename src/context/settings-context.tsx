import { createContext, useContext, useState, ReactNode } from 'react';

export type Settings = {
    readerMode: boolean
}

type SettingsContextType = {
    settings: Settings,
    setSettings: (settings: Settings) => void
}

const defaultSettings: Settings = { readerMode: false };

const SettingsContext = createContext<SettingsContextType>({
    settings: defaultSettings,
    setSettings: () => { },
});

export const useSettings = () => {
    return useContext(SettingsContext);
}

type Props = {
    children?: ReactNode
}

export const SettingsProvider = ({ children }: Props) => {
    const [settings, setSettings] = useState(defaultSettings);

    return (
        <SettingsContext.Provider value={{ settings, setSettings }}>
            {children}
        </SettingsContext.Provider>
    )
}