import { Link, useRouteError } from 'react-router-dom';
import { CalligraphyLogo } from '../components/calligraphy-logo';
import { CorpusError, ErrorCode } from './corpus-error';
import { Footer } from '../components/footer';
import './error-page.scss';

const errorCodeDescriptionMap = new Map<ErrorCode, string>([
    ['404', 'We\'re sorry, the page you were looking for couldn\'t be found.']
]);

export const ErrorPage = () => {
    const e = useRouteError();
    console.error(e);

    const message = e instanceof Error ? (e as Error).message : 'Something went wrong!';

    let description;
    if (e instanceof CorpusError) {
        description = errorCodeDescriptionMap.get(e.code);
    }

    return (
        <div className='error-page'>
            <CalligraphyLogo />
            <h1>{message}</h1>
            {
                description &&
                <p className='description'>{description}</p>
            }
            <p>
                <Link to='/'>The Quranic Arabic Corpus</Link>
            </p>
            <Footer />
        </div>
    )
}