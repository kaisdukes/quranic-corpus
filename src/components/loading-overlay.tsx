import { useEffect, useState } from 'react';
import './loading-overlay.scss';

export const LoadingOverlay = () => {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        let timer: NodeJS.Timeout | undefined = undefined;

        setSeconds(1);
        timer = setInterval(() => {
            setSeconds((prevSeconds) => prevSeconds + 1);
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <div className='loading-overlay'>
            <div className='loader'>
                <div className='circle'></div>
                <div className='timer'>{seconds}</div>
            </div>
        </div>
    );
}