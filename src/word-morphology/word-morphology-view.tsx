import { Fragment } from 'react';
import { WordMorphology } from '../corpus/morphology/word-morphology';
import { TaggedToken } from './tagged-token';
import { CloseButton } from '../components/close-button';
import { useLocation } from 'react-router-dom';
import './word-morphology-view.scss';

type Props = {
    wordMorphology: WordMorphology
}

export const WordMorphologyView = ({ wordMorphology }: Props) => {
    const { pathname: url } = useLocation();
    const { token, summary, segmentDescriptions, arabicGrammar } = wordMorphology;
    return (
        <div className='word-morphology-view'>
            <header>
                <h1>Quranic Grammar</h1>
                <CloseButton url={url} />
            </header>
            <TaggedToken token={token} />
            <br />
            <section>
                {summary}<br />
                <br />
                {
                    segmentDescriptions.map((description, i) => (
                        <Fragment key={`description-${i}`}>{description}<br /></Fragment>
                    ))
                }
                <br />
                {arabicGrammar}
            </section>
        </div>
    )
}