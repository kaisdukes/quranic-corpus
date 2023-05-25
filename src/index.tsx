import 'reflect-metadata'
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LoadingOverlay } from './components/loading-overlay';
import { ChapterService } from './corpus/orthography/chapter-service';
import { OverlayProvider, useOverlay } from './context/overlay-context';
import { Home } from './home/home';
import { WordByWord } from './wbw/word-by-word';
import { container } from 'tsyringe';
import './theme/styles.scss';
import { ReaderSettingsProvider } from './context/reader-settings-context';

const chapterRoutes = Array.from({ length: 114 }, (_, i) => {
    const chapterNumber = i + 1;
    return {
        path: `/${chapterNumber}`,
        element: <WordByWord chapterNumber={chapterNumber} />,
    };
});

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    },
    ...chapterRoutes
]);

const Root = () => {
    const { overlay, setOverlay } = useOverlay();
    const chapterService = container.resolve(ChapterService);

    const [booting, setBooting] = useState(true);

    useEffect(() => {
        const bootUp = async () => {
            try {
                await chapterService.cacheChapters();
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