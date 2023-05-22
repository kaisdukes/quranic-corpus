import { useEffect, useState } from 'react';
import './loading-overlay.scss';

type Props = {
    visible: boolean;
};

export const LoadingOverlay = ({ visible }: Props) => {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        let timer: NodeJS.Timeout | undefined = undefined;

        if (visible) {
            setSeconds(1);
            timer = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds + 1);
            }, 1000);
        } else {
            clearInterval(timer);
        }

        return () => {
            clearInterval(timer);
        };
    }, [visible]);

    return (
        <div className={`loading-overlay ${visible ? 'visible' : ''}`}>
            <div className='loader'>
                <div className='circle'></div>
                <div className='timer'>{seconds}</div>
            </div>
        </div>
    );
}