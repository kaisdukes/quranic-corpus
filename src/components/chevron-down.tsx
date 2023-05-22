type Props = {
    className?: string
}

export const ChevronDown = ({ className }: Props) => (
    <svg className={className} viewBox='0 0 512 512'>
        <polyline
            points='112 184 256 328 400 184'
            style={{ fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 48, stroke: 'currentColor' }}
        />
    </svg>
)