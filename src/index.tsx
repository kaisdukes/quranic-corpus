import 'reflect-metadata'
import { createRoot } from 'react-dom/client';
import { Home } from './pages/home';
import './theme/styles.scss';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<Home />);