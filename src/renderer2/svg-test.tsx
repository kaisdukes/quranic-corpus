import { ArabicTextService } from '../arabic/arabic-text-service';
import { container } from 'tsyringe';
import './svg-test.scss';

export const SVGTest = () => {

    const text = 'بِٱلْحَقِّ';
    const segments = [text.slice(0, 2), text.slice(2, 5), text.slice(5, 10)];
    const arabicTextService = container.resolve(ArabicTextService);
    arabicTextService.insertZeroWidthJoinersForSafari(segments);
    const classNames = ['a', 'b', 'c'];

    return (
        <div className='svg-test'>
            <h1>SVG Test: tspans + zero width joiners</h1>
            <svg width={500} height={300}>
                <text className='foo' x={20} y={35}>6:5:3</text>
                <text className='bar' x={300} y={120}>{text}</text>
                <text x={300} y={220}>
                    {
                        segments.map((segment, i) => <tspan className={`bar ${classNames[i]}`} dangerouslySetInnerHTML={{ __html: segment }} />)
                    }
                </text>
            </svg>
            <h1>DOM Test: spans + zero width joiners</h1>
            <div>
                {
                    segments.map((segment, i) => <span className={`bar ${classNames[i]}`} dangerouslySetInnerHTML={{ __html: segment }} />)
                }
            </div>
        </div>
    )
}