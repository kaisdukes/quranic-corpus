import { Fragment, useEffect, useRef, useState } from 'react';
import { MorphologyService } from '../corpus/morphology/morphology-service';
import { VerseElement } from '../treebank/verse-element';
import { Verse } from '../corpus/orthography/verse';
import { container } from 'tsyringe';
import './word-by-word-view.scss';

export const WordByWordView = () => {

    const [verses, setVerses] = useState<Verse[]>([]);
    const loadingRef = useRef<HTMLDivElement>(null);
    const morphologyService = container.resolve(MorphologyService);
    const location = [78, 1];
    const [startChapterNumber, startVerseNumber] = location;
    const [loading, setLoading] = useState(false);

    const loadVerses = async () => {
        setLoading(true);
        const newVerses = await morphologyService.getMorphology([startChapterNumber, startVerseNumber + verses.length], 5);
        setVerses(prevVerses => [...prevVerses, ...newVerses]);
        setLoading(false);
    };

    useEffect(() => {
        loadVerses();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !loading) {
                loadVerses();
            }
        }, {
            rootMargin: '0px',
            threshold: 0.1
        });

        if (loadingRef.current) {
            observer.observe(loadingRef.current);
        }

        return () => {
            if (loadingRef.current) {
                observer.unobserve(loadingRef.current);
            }
        };
    }, [verses, loading]);

    return (
        <div className='word-by-word-view'>
            {
                verses.map((verse, i) => (
                    <Fragment key={`verse-${i}`}>
                        {i > 0 && <hr />}
                        <VerseElement verse={verse} />
                    </Fragment>
                ))
            }
            <div ref={loadingRef}>
                {loading && 'Loading...'}
            </div>
        </div>
    );
};