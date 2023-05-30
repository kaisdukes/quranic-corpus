import 'reflect-metadata'
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LoadingOverlay } from './components/loading-overlay';
import { MetadataService } from './metadata-service';
import { OverlayProvider, useOverlay } from './context/overlay-context';
import { ReaderSettingsProvider } from './context/reader-settings-context';
import { Home } from './home/home';
import { WordByWord, resolveLocation } from './wbw/word-by-word';
import { Treebank } from './treebank/treebank';
import { ErrorPage } from './errors/error-page';
import { container } from 'tsyringe';
import './theme/styles.scss';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/treebank',
        element: <Treebank />
    },
    {
        path: '/:location',
        loader: resolveLocation,
        element: <WordByWord />,
        errorElement: <ErrorPage />
    }
]);

const Root = () => {
    const metadataService = container.resolve(MetadataService);
    const { overlay, setOverlay } = useOverlay();
    const [booting, setBooting] = useState(true);

    useEffect(() => {
        const bootUp = async () => {
            try {
                await metadataService.cacheMetadata();
            } catch (error) {
                console.error('Failed to boot up!', error);
            } finally {
                setOverlay(false);
                setBooting(false);
            }
        };

        bootUp();
    }, []);

    return (
        <>
            {!booting && <RouterProvider router={router} />}
            <LoadingOverlay visible={overlay} />
        </>
    )
}

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <OverlayProvider>
        <ReaderSettingsProvider>
            <Root />
        </ReaderSettingsProvider>
    </OverlayProvider>
);