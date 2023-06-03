import { TextChainView } from './text-chain-view';
import './svg-test2.scss';

export const SVGTest2 = () => {
    const words = ['Hello', 'foo', 'xxx'];

    return (
        <div className='svg-test2'>
            <h1>SVG Test #2</h1>
            <TextChainView words={words} />
        </div>
    )
}