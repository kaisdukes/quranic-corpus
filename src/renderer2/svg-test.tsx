import './svg-test.scss';

export const SVGTest = () => {

    const text = 'بِٱلْحَقِّ';

    return (
        <div className='svg-test'>
            <h1>SVG Test</h1>
            <svg width={500} height={500}>
                <text className='foo' x={20} y={50}>6:5:3</text>
                <text className='bar' x={300} y={150}>{text}</text>
                <text x={300} y={250}>
                    <tspan className='bar a'>{text.slice(0, 2)}</tspan>
                    <tspan className='bar b'>{text.slice(2, 5)}</tspan>
                    <tspan className='bar c'>{text.slice(5, 10)}</tspan>
                </text>
            </svg>
        </div>
    )
}