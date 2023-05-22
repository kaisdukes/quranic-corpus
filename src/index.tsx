import 'reflect-metadata'
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home } from './home/home';
import { WordByWord } from './wbw/word-by-word';
import './theme/styles.scss';

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

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<RouterProvider router={router} />)