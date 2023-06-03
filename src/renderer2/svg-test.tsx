import { SVGView, SegmentedWord } from './svg-view';
import { ArabicTextService } from '../arabic/arabic-text-service';
import { container } from 'tsyringe';
import './svg-test.scss';

export const SVGTest = () => {

    const text = 'بِٱلْحَقِّ';
    const classNames = ['a', 'b', 'c'];
    const segments = [text.slice(0, 2), text.slice(2, 5), text.slice(5, 10)];
    const arabicTextService = container.resolve(ArabicTextService);
    arabicTextService.insertZeroWidthJoinersForSafari(segments);

    const words = ['Hello', 'xyz', 'ggg'];
    const segmentedWords: SegmentedWord[] = [{ segments, classNames }]

    return (
        <div className='svg-test'>
            <h1>SVG Test</h1>
            <SVGView words={words} segmentedWords={segmentedWords} />
        </div>
    )
}