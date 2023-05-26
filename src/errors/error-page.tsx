import { useRouteError } from 'react-router-dom';
import { CorpusError, ErrorCode } from './corpus-error';
import './error-page.scss';

const errorCodeDescriptionMap = new Map<ErrorCode, string>([
    ['404', 'We\'re sorry, the page you were looking for couldn\'t be found.']
]);

export const ErrorPage = () => {
    const e = useRouteError();
    console.log(e);

    const message = e instanceof Error ? (e as Error).message : 'Something went wrong!';

    let description;
    if (e instanceof CorpusError) {
        description = errorCodeDescriptionMap.get(e.code);
    }

    return (
        <div className='error-page'>
            <h2>{message}</h2>
            {description && <p>{description}</p>}
        </div>
    )
}