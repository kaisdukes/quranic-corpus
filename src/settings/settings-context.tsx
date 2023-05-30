import { createContext, useContext, useState, ReactNode } from 'react';
import { Settings } from './settings';

export type SettingsContextType = {
    settings: Settings,
    _setSettings: (settings: Settings) => void
}

const defaultSettings: Settings = {
    readerMode: false,
    translations: []
}

const SettingsContext = createContext<SettingsContextType>({
    settings: defaultSettings,
    _setSettings: () => { },
})

export const useSettings = () => {
    return useContext(SettingsContext);
}

type Props = {
    children?: ReactNode
}

export const SettingsProvider = ({ children }: Props) => {
    const [settings, _setSettings] = useState(defaultSettings);

    return (
        <SettingsContext.Provider value={{ settings, _setSettings }}>
            {children}
        </SettingsContext.Provider>
    )
}