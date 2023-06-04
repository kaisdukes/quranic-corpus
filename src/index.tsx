import 'reflect-metadata'
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LoadingOverlay } from './components/loading-overlay';
import { theme, applyStyles } from './theme/theme';
import { FontService } from './typography/font-service';
import { MetadataService } from './metadata-service';
import { SettingsService } from './settings/settings-service';
import { OverlayProvider, useOverlay } from './overlay-context';
import { SettingsProvider, useSettings } from './settings/settings-context';
import { Home } from './home/home';
import { WordByWord, wordByWordLoader } from './wbw/word-by-word';
import { Treebank, treebankLoader } from './treebank/treebank';
import { Treebank2 } from './treebank2/treebank2';
import { ErrorPage } from './errors/error-page';
import { container } from 'tsyringe';
import './theme/styles.scss';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
        errorElement: <ErrorPage />
    },
    {
        path: '/treebank/:location',
        loader: treebankLoader,
        element: <Treebank />,
        errorElement: <ErrorPage />
    },
    {
        path: '/treebank2/:location',
        loader: treebankLoader,
        element: <Treebank2 />,
        errorElement: <ErrorPage />
    },
    {
        path: '/wordbyword/:location',
        loader: wordByWordLoader,
        element: <WordByWord />,
        errorElement: <ErrorPage />
    }
]);

const Root = () => {
    const fontService = container.resolve(FontService);
    const metadataService = container.resolve(MetadataService);
    const settingsService = container.resolve(SettingsService);

    const { overlay, setOverlay } = useOverlay();
    const settingsContext = useSettings();
    const [booting, setBooting] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const bootUp = async () => {
            try {
                applyStyles(theme);
                await fontService.loadFonts();
                await metadataService.cacheMetadata();
                settingsService.loadSettings(settingsContext);
            } catch (e) {
                setError(e as Error);
            } finally {
                setOverlay(false);
                setBooting(false);
            }
        };

        bootUp();
    }, []);

    if (error) {
        return <>{error.message}</>;
    }

    return (
        <>
            {!booting && <RouterProvider router={router} />}
            {overlay && <LoadingOverlay />}
        </>
    )
}

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <OverlayProvider>
        <SettingsProvider>
            <Root />
        </SettingsProvider>
    </OverlayProvider>
)