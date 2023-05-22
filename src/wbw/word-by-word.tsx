import { Fragment, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
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

export const WordByWord = () => {
    const { chapterNumber, verseNumber } = useParams();
    const parsedChapterNumber = Number(chapterNumber);
    const parsedVerseNumber = Number(verseNumber);

    // TODO:// update the verses type to include these params
    const [startVerse, setStartVerse] = useState(parsedVerseNumber);
    const [endVerse, setEndVerse] = useState(parsedVerseNumber + 5);

    // Used to make sure the previous verses don't automatically cause a rerender
    const [loadingPrevious, setLoadingPrevious] = useState(false);


    const chapterService = container.resolve(ChapterService);
    const chapter = chapterService.getChapter(parsedChapterNumber);

    const [verses, setVerses] = useState<Verse[]>([]);

    const topLoadingRef = useRef<HTMLDivElement>(null);
    const bottomLoadingRef = useRef<HTMLDivElement>(null);

    const morphologyService = container.resolve(MorphologyService);
    const [loading, setLoading] = useState(false);
    const [chapterEnd, setChapterEnd] = useState(false);

    const loadNextVerses = async () => {
        setLoading(true);
        console.log('LOADING NEXT VERSES ' + endVerse);
        const newVerses = await morphologyService.getMorphology([parsedChapterNumber, endVerse], 5);
        setLoading(false);
        if (newVerses.length > 0) {
            setVerses(prevVerses => [...prevVerses, ...newVerses]);
            setEndVerse(endVerse + 5);
        } else {
            setChapterEnd(true);
        }
    };

    const loadPreviousVerses = async () => {
        setLoadingPrevious(true);
        setLoading(true);
        console.log('LOADING PREVIOUS VERSE ' + startVerse);
        try {
            const newVerses = await morphologyService.getMorphology([parsedChapterNumber, Math.max(0, startVerse - 5)], 5);
            setLoading(false);
            if (newVerses.length > 0) {
                setVerses(prevVerses => [...newVerses, ...prevVerses]);
                setStartVerse(Math.max(0, startVerse - 5));
            }
            // Add a delay before resetting loadingPrevious
            setTimeout(() => setLoadingPrevious(false), 200);
        } catch (err) {
            console.log(err)
            setLoadingPrevious(false);
        }

    };


    // const loadPreviousVerses = async () => {
    //     setLoading(true);
    //     console.log('LOADING PREVIOUS VERSE ' + startVerse);
    //     try {
    //         const newVerses = await morphologyService.getMorphology([parsedChapterNumber, Math.max(0, startVerse - 5)], 5);
    //         setLoading(false);
    //         if (newVerses.length > 0) {
    //             setVerses(prevVerses => [...newVerses, ...prevVerses]);
    //             setStartVerse(Math.max(0, startVerse - 5));
    //         }
    //     } catch (error) {
    //         console.error(error);  // This will log more information about the error
    //     }
    // };


    useEffect(() => {
        setVerses([]);
        setChapterEnd(false);
        loadNextVerses().catch((err) => {console.log(err)});
    }, [parsedChapterNumber, parsedVerseNumber]);

    useEffect(() => {
        const observerTop = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !loading && !loadingPrevious) {
                loadPreviousVerses();
            }
        }, {
            rootMargin: '0px',
            threshold: 0.1
        });

        const observerBottom = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !loading && !chapterEnd) {
                loadNextVerses();
            }
        }, {
            rootMargin: '0px',
            threshold: 0.1
        });

        if (topLoadingRef.current) {
            observerTop.observe(topLoadingRef.current);
        }

        if (bottomLoadingRef.current) {
            observerBottom.observe(bottomLoadingRef.current);
        }

        return () => {
            if (topLoadingRef.current) {
                observerTop.unobserve(topLoadingRef.current);
            }
            if (bottomLoadingRef.current) {
                observerBottom.unobserve(bottomLoadingRef.current);
            }
        };
    }, [verses, loading, chapterEnd]);

    return (
        <NavigationContainer header={<NavigationHeader chapterNumber={parsedChapterNumber} />}>
            <div className='word-by-word'>
                <div className='chapter-header'>
                    <img src={chapter.city === 'Makkah' ? makkah : madinah} />
                    <h1>{parsedChapterNumber}. {formatChapterTitle(chapter)}</h1>
                </div>
                <div className='word-by-word-view'>
                    <div ref={topLoadingRef}>Loading...</div>
                    {
                        verses.map((verse, i) => (
                            <Fragment key={`verse-${i}`}>
                                <VerseElement verse={verse} />
                            </Fragment>
                        ))
                    }
                    <div ref={bottomLoadingRef}>Loading...</div>
                </div>
                <div>
                    {loading && 'Loading...'}
                </div>
                <Footer />
            </div>
        </NavigationContainer>
    )
}
