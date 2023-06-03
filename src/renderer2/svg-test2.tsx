import { SVGView } from './svg-view';
import './svg-test2.scss';

export const SVGTest2 = () => {
    const words = ['Hello', 'xyz', 'ggg'];

    return (
        <div className='svg-test2'>
            <h1>SVG Test #2</h1>
            <SVGView words={words} />
        </div>
    )
}