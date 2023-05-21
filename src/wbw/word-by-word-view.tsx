import { useEffect, useState } from 'react';
import { MorphologyService } from '../corpus/morphology/morphology-service';
import { VerseElement } from '../treebank/verse-element';
import { Verse } from '../corpus/orthography/verse';
import { container } from 'tsyringe';
import './word-by-word-view.scss';

export const WordByWordView = () => {

    const [verses, setVerses] = useState<Verse[]>();
    const morphologyService = container.resolve(MorphologyService);
    const location = [4, 79];

    useEffect(() => {
        (async () => {
            setVerses(await morphologyService.getMorphology(location, 5));
        })();
    }, []);

    return (
        <div className='word-by-word-view'>
            {
                verses && verses.map((verse, i) => (
                    <VerseElement
                        key={`verse-${i}`}
                        verse={verse} />
                ))
            }
        </div>
    )
}