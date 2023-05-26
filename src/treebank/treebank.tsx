import { DependencyGraphView } from '../treebank/dependency-graph-view';
import './treebank.scss';

export const Treebank = () => {
    return (
        <div className='treebank'>
            <h1>Corpus 2.0: Renderer Test</h1>
            <p>
                This is a test page optimized for viewing on a desktop. Its purpose is to evaluate a new vector
                graphics renderer for the upcoming 2.0 version of the Quranic Arabic Corpus. We're comparing two
                images here: the current bitmap-rendered image on the left from the existing corpus, and the new
                vector-rendered image on the right. Please note, the image on the right is still under development
                and doesn't completely replicate the dependency graph yet.
            </p>
            <div className='compare'>
                <div>
                    <h3>Current: Bitmap Graphics Rendering</h3>
                    <div className='bitmap-container'>
                        <table className='token-table'>
                            <tbody>
                                <tr>
                                    <td>
                                        <span className='location'>(4:79:15)</span><br />
                                        <a href='https://corpus.quran.com//qurandictionary.jsp?q=rsl#(4:79:15)'>rasūlan</a><br />
                                        (as) a Messenger
                                    </td>
                                    <td>
                                        <span className='location'>(4:79:14)</span><br />
                                        <a href='https://corpus.quran.com/qurandictionary.jsp?q=nws#(4:79:14)'>lilnnāsi</a><br />
                                        for the people
                                    </td>
                                    <td>
                                        <span className='location'>(4:79:13)</span><br />
                                        <a href='https://corpus.quran.com//qurandictionary.jsp?q=rsl#(4:79:13)'>wa-arsalnāka</a><br />
                                        And We have sent you
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <img src='https://corpus.quran.com/graphimage?id=2553' />
                    </div>
                </div>
                <div>
                    <h3>Prototype: Vector Graphics Rendering</h3>
                    <DependencyGraphView />
                </div>
            </div>
        </div>
    )
}