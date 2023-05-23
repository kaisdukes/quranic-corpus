import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NavigationContainer } from '../navigation/navigation-container';
import { NavigationHeader } from '../navigation/navigation-header';
import { ChapterService } from '../corpus/orthography/chapter-service';
import { formatChapterTitle } from '../corpus/orthography/chapter';
import { MorphologyService } from '../corpus/morphology/morphology-service';
import VerseElement  from '../treebank/verse-element';
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
    const [stickyVerse, setStickyVerse] = useState(parsedVerseNumber); // this is the verse to scroll to whenver verses have been updates


    const chapterService = container.resolve(ChapterService);
    const chapter = chapterService.getChapter(parsedChapterNumber);

    // Since verses can now be fetched bi-directionally we need to store as dictionary so they don't get overwritten.
    const [verses, setVerses] = useState<{[key: number]: Verse}>({});
    const verseRefs = useRef<{[key: number]: React.RefObject<HTMLDivElement>}>({});

    // Handle the position of the top and bottom references.
    const topLoadingRef = useRef<HTMLDivElement>(null);
    const bottomLoadingRef = useRef<HTMLDivElement>(null);

    const morphologyService = container.resolve(MorphologyService);
    const loading = useRef(false);
    const [chapterEnd, setChapterEnd] = useState(false);

    const loadInitialVerses = async () => {
        loading.current = true;

        const newVerses = await morphologyService.getMorphology([parsedChapterNumber, Math.max(1, parsedVerseNumber - 2)], 5);
        loading.current = false
        if (newVerses.length > 0) {
            let verseDict = { ...verses };
            for (let i = 0; i < newVerses.length; i++) {
                verseDict[startVerse + i - 2] = newVerses[i];
            }
            setVerses(verseDict);
            setStartVerse(parsedVerseNumber - 2);
            setEndVerse(parsedVerseNumber + 2);
        } else {
            setChapterEnd(true);
        }
    }

    const loadNextVerses = async () => {
        if (loading.current) return;
        loading.current = true;
        const _oldEndVerse = endVerse;
        console.log("Loading next five verses: ", endVerse)
        const newVerses = await morphologyService.getMorphology([parsedChapterNumber, endVerse + 1], 5);
        loading.current = false;
        if (newVerses.length > 0) {
            let verseDict = { ...verses };
            for (let i = 0; i < newVerses.length; i++) {
                verseDict[endVerse + i + 1] = newVerses[i];
            }
            setVerses(verseDict);
            setStickyVerse(_oldEndVerse);

            setEndVerse(endVerse + 5);
        } else {
            console.log("Reached end of Chapter")
            setChapterEnd(true);
        }
    };


    const loadPreviousVerses = async () => {
        if (startVerse===0 || loading.current) return;
        const _oldStartVerse = startVerse;
        loading.current = true;
        console.log("Loading previous five verses: ", startVerse)
        const newVerses = await morphologyService.getMorphology([parsedChapterNumber, Math.max(1, startVerse - 5)], 5);
        loading.current = false;
        if (newVerses.length > 0) {
            let verseDict = { ...verses };
            for (let i = 0; i < newVerses.length; i++) {
                verseDict[startVerse - 5 + i] = newVerses[i];
            }
            setVerses(verseDict);
            setStickyVerse(_oldStartVerse);
            setStartVerse(Math.max(0, startVerse - 5));
        }
    };

    // Handle scroll to correct verse.
    useEffect(() => {
        if (verses[stickyVerse]) {
            verseRefs.current[stickyVerse].current?.scrollIntoView();
        }
    }, [verses, parsedVerseNumber]);

    useEffect(() => {
        setVerses([]);
        setChapterEnd(false);
        loadInitialVerses().then((_) => {

            })
    }, [parsedChapterNumber, parsedVerseNumber]);

    useEffect(() => {
        const observerTop = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !loading.current && startVerse !=0 ) {
                loadPreviousVerses();
            }
        }, {
            rootMargin: '0px',
            threshold: 0.1
        });

        const observerBottom = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !loading.current && !chapterEnd) {
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
    }, [verses, loading.current, chapterEnd]);

    return (
        <NavigationContainer header={<NavigationHeader chapterNumber={parsedChapterNumber} />}>
            <div className='word-by-word'>
                <div className='chapter-header'>
                    <img src={chapter.city === 'Makkah' ? makkah : madinah} />
                    <h1>{parsedChapterNumber}. {formatChapterTitle(chapter)}</h1>
                </div>
                <div className='word-by-word-view'>
                    {startVerse === 0 ? <></> : <div ref={topLoadingRef}>Loading...</div>}
                    {
                        Object.keys(verses).map(Number).sort((a, b) => a - b).map((verseNumber) => {
                            // If there's not already a ref for this verse, create one
                            if (!verseRefs.current[verseNumber]) {
                                verseRefs.current[verseNumber] = React.createRef();
                            }

                            return (
                                <Fragment key={`verse-${verseNumber}`}>
                                    <VerseElement verse={verses[verseNumber]} ref={verseRefs.current[verseNumber]} />
                                </Fragment>
                            );
                        })
                    }
                    {
                        chapterEnd ?
                            <></> :
                            <div ref={loading.current ? null : bottomLoadingRef}>{loading.current ? "loading..." : ""}</div>
                    }
                </div>
                <Footer />
            </div>
        </NavigationContainer>
    )
}
