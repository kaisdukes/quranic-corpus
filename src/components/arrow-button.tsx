import { combineClassNames } from '../theme/class-names';
import './arrow-button.scss';

type Props = {
    right?: boolean,
    enabled: boolean,
    onClick: () => void
}

export const ArrowButton = ({ right, enabled, onClick }: Props) => {
    return (
        <button
            className={combineClassNames('arrow-button', enabled ? 'enabled' : 'disabled')}
            onClick={() => { if (enabled) onClick() }}>
            <svg viewBox='0 0 100 100'>
                <path
                    fill='currentColor'
                    d='M55.18,32.24l2.56,2.54L42.65,50,57.74,65.22l-2.56,2.54L37.59,50Z'
                    transform={right ? 'translate(100, 100) rotate(180)' : undefined} />
            </svg>
        </button >
    )
}