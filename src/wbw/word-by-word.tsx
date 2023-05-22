import { Fragment, useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '../navigation/navigation-container';
import { NavigationHeader } from '../navigation/navigation-header';
import { ChapterService } from '../corpus/orthography/chapter-service';
import { formatChapterTitle } from '../corpus/orthography/chapter';
import { MorphologyService } from '../corpus/morphology/morphology-service';
import { VerseElement } from '../treebank/verse-element';
import { Verse } from '../corpus/orthography/verse';
import { Footer } from '../components/footer';
import { container } from 'tsyringe';
import makkah from '../images/makkah.svg';
import madinah from '../images/madinah.svg';
import './word-by-word.scss';

type Props = {
    chapterNumber: number
}

export const WordByWord = ({ chapterNumber }: Props) => {
    const chapterService = container.resolve(ChapterService);
    const chapter = chapterService.getChapter(chapterNumber);

    const [verses, setVerses] = useState<Verse[]>([]);
    const loadingRef = useRef<HTMLDivElement>(null);
    const morphologyService = container.resolve(MorphologyService);
    const [loading, setLoading] = useState(false);
    const [chapterEnd, setChapterEnd] = useState(false);

    const loadVerses = async (startVerseNumber: number) => {
        setLoading(true);
        console.log('LOADING VERSE ' + startVerseNumber);
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
        <NavigationContainer header={<NavigationHeader chapterNumber={chapterNumber} />}>
            <div className='word-by-word'>
                <div className='chapter-header'>
                    <img src={chapter.city === 'Makkah' ? makkah : madinah} />
                    <h1>{chapterNumber}. {formatChapterTitle(chapter)}</h1>
                </div>
                <div className='word-by-word-view'>
                    {
                        verses.map((verse, i) => (
                            <Fragment key={`verse-${i}`}>
                                <VerseElement verse={verse} />
                            </Fragment>
                        ))
                    }
                </div>
                <div>
                    {loading && 'Loading...'}
                </div>
                <Footer ref={loadingRef} />
            </div>
        </NavigationContainer>
    )
}