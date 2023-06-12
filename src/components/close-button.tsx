import './close-button.scss';

type Props = {
    onClick: () => void
}

export const CloseButton = ({ onClick }: Props) => {
    return (
        <svg
            className='close-button'
            viewBox='0 0 100 100'
            onClick={onClick}>
            <path
                stroke='currentColor'
                strokeWidth={3.5}
                d='M 38 38 L 62 62 M 62 38 L 38 62' />
        </svg>
    )
}