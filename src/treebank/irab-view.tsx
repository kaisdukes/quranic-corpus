import './irab-view.scss';

type Props = {
    irab: string[]
}

export const IrabView = ({ irab }: Props) => {
    return (
        <div className='irab-view'>
            <h3>Grammar (إعراب)</h3>
            <ul>
                {
                    irab.map((item, i) => (
                        <li key={`irab-${i}`}>{item}</li>
                    ))
                }
            </ul>
        </div>
    )
}