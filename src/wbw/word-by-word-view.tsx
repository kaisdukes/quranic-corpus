import { Fragment, useEffect, useRef, useState } from 'react';
import { MorphologyService } from '../corpus/morphology/morphology-service';
import { VerseElement } from '../treebank/verse-element';
import { Verse } from '../corpus/orthography/verse';
import { Footer } from '../components/footer';
import { container } from 'tsyringe';
import './word-by-word-view.scss';

type Props = {
    chapterNumber: number
}

export const WordByWordView = ({ chapterNumber }: Props) => {

    const [verses, setVerses] = useState<Verse[]>([]);
    const loadingRef = useRef<HTMLDivElement>(null);
    const morphologyService = container.resolve(MorphologyService);
    const [loading, setLoading] = useState(false);
    const [chapterEnd, setChapterEnd] = useState(false);

    const loadVerses = async (startVerseNumber: number) => {
        setLoading(true);
        const newVerses = await morphologyService.getMorphology([chapterNumber, startVerseNumber], 5);
        if (newVerses.length > 0) {
            setVerses(prevVerses => [...prevVerses, ...newVerses]);
        } else {
            setChapterEnd(true);
        }
        setLoading(false);
    };

    useEffect(() => {
        setVerses([]);
        setChapterEnd(false);
        loadVerses(1);
    }, [chapterNumber]);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !loading && !chapterEnd) {
                loadVerses(verses.length + 1);
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
    }, [verses, loading, chapterEnd]);

    return (
        <div className='word-by-word-view'>
            {
                verses.map((verse, i) => (
                    <Fragment key={`verse-${i}`}>
                        <VerseElement verse={verse} />
                    </Fragment>
                ))
            }
            <div>
                {loading && 'Loading...'}
            </div>
            <Footer ref={loadingRef}/>
        </div>
    )
}