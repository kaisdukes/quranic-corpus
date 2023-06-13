import './irab-view.scss';

type Props = {
    irab: string[]
}

export const IrabView = ({ irab }: Props) => {
    return (
        <div className='irab-view'>
            <h1>Grammar (إعراب)</h1>
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