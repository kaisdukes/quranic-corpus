import { ArabicTextService } from '../arabic/arabic-text-service';
import { container } from 'tsyringe';
import './svg-test.scss';

export const SVGTest = () => {
    const text = 'بِٱلْحَقِّ';

    const classNames = ['a', 'b', 'c'];
    const segments = [text.slice(0, 2), text.slice(2, 5), text.slice(5, 10)];

    const arabicTextService = container.resolve(ArabicTextService);
    arabicTextService.insertZeroWidthJoinersForSafari(segments);

    return (
        <div className='svg-test'>
            <h1>SVG Test</h1>
            <svg width={400} height={400}>
                <text x={200} y={100}>
                    {
                        segments.map((segment, i) =>
                            <tspan
                                className={`bar ${classNames[i]}`}
                                dangerouslySetInnerHTML={{ __html: segment }} />
                        )
                    }
                </text>
            </svg>
        </div>
    )
}