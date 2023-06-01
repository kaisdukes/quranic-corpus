import 'reflect-metadata'
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LoadingOverlay } from './components/loading-overlay';
import { MetadataService } from './metadata-service';
import { SettingsService } from './settings/settings-service';
import { OverlayProvider, useOverlay } from './overlay-context';
import { SettingsProvider, useSettings } from './settings/settings-context';
import { Home } from './home/home';
import { WordByWord, resolveLocation } from './wbw/word-by-word';
import { Treebank } from './treebank/treebank';
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
        path: '/treebank',
        element: <Treebank />,
        errorElement: <ErrorPage />
    },
    {
        path: '/wordbyword/:location',
        loader: resolveLocation,
        element: <WordByWord />,
        errorElement: <ErrorPage />
    }
]);

const Root = () => {
    const metadataService = container.resolve(MetadataService);
    const settingsService = container.resolve(SettingsService);

    const { overlay, setOverlay } = useOverlay();
    const settingsContext = useSettings();
    const [booting, setBooting] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const bootUp = async () => {
            try {
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