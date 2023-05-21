import { Fragment, useEffect, useState } from 'react';
import { MorphologyService } from '../corpus/morphology/morphology-service';
import { VerseElement } from '../treebank/verse-element';
import { Verse } from '../corpus/orthography/verse';
import { container } from 'tsyringe';
import './word-by-word-view.scss';

export const WordByWordView = () => {

    const [verses, setVerses] = useState<Verse[]>();
    const morphologyService = container.resolve(MorphologyService);
    const location = [2, 255];

    useEffect(() => {
        (async () => {
            setVerses(await morphologyService.getMorphology(location, 5));
        })();
    }, []);

    return (
        <div className='word-by-word-view'>
            {
                verses && verses.map((verse, i) => (
                    <Fragment key={`verse-${i}`}>
                        {i > 0 && <hr />}
                        <VerseElement verse={verse} />
                    </Fragment>
                ))
            }
        </div>
    )
}