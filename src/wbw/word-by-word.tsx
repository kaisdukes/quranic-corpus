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
import {start} from "repl";

export const WordByWord = () => {
    const { chapterNumber, verseNumber } = useParams();
    const parsedChapterNumber = Number(chapterNumber);
    const parsedVerseNumber = Number(verseNumber);

    // TODO:// update the verses type to include these params
    const [startVerse, setStartVerse] = useState(parsedVerseNumber);
    const [endVerse, setEndVerse] = useState(parsedVerseNumber + 5);
    const [stickyVerse, setStickyVerse] = useState(parsedVerseNumber); // this is the verse to scroll to whenver verses have been updates

    // Used to make sure the previous verses don't automatically cause a rerender
    const [loadingPrevious, setLoadingPrevious] = useState(false);

    const chapterService = container.resolve(ChapterService);
    const chapter = chapterService.getChapter(parsedChapterNumber);

    // Since verses can now be fetched bi-directionally we need to store as dictionary so they don't get overwritten.
    const [verses, setVerses] = useState<{[key: number]: Verse}>({});
    const verseRefs = useRef<{[key: number]: React.RefObject<HTMLDivElement>}>({});



    const topLoadingRef = useRef<HTMLDivElement>(null);
    const bottomLoadingRef = useRef<HTMLDivElement>(null);

    const morphologyService = container.resolve(MorphologyService);
    const [loading, setLoading] = useState(false);
    const [chapterEnd, setChapterEnd] = useState(false);

    const loadInitialVerses = async () => {
        setLoading(true);

        const newVerses = await morphologyService.getMorphology([parsedChapterNumber, Math.max(0, parsedVerseNumber - 2)], 5);
        setLoading(false);
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
        setLoading(true);
        console.log("Loading next five verses: ", endVerse)
        const newVerses = await morphologyService.getMorphology([parsedChapterNumber, endVerse + 1], 5);
        setLoading(false);
        if (newVerses.length > 0) {
            let verseDict = { ...verses };
            for (let i = 0; i < newVerses.length; i++) {
                verseDict[endVerse + i + 1] = newVerses[i];
            }
            setVerses(verseDict);
            setEndVerse(endVerse + 5);
        } else {
            setChapterEnd(true);
        }
    };


    const loadPreviousVerses = async () => {
        const _oldStartVerse = startVerse;
        setLoadingPrevious(true);
        setLoading(true);
        console.log("Loading previous five verses: ", startVerse)
        const newVerses = await morphologyService.getMorphology([parsedChapterNumber, Math.max(0, startVerse - 5)], 5);
        setLoading(false);
        if (newVerses.length > 0) {
            let verseDict = { ...verses };
            for (let i = 0; i < newVerses.length; i++) {
                verseDict[startVerse - 5 + i] = newVerses[i];
            }
            setVerses(verseDict);
            setStickyVerse(_oldStartVerse);
            setStartVerse(Math.max(0, startVerse - 5));
            // we need to navigate to the previous start vers
        }
    };

    const [hasScrolledToVerse, setHasScrolledToVerse] = useState(false);

    useEffect(() => {
        // Only perform the scroll if we haven't done it before
        if (!hasScrolledToVerse && verses[parsedVerseNumber]) {
            verseRefs.current[parsedVerseNumber].current?.scrollIntoView();
            // Update the state to indicate we have scrolled to the verse
            setHasScrolledToVerse(true);
        }
    }, [verses, parsedVerseNumber, hasScrolledToVerse]);

    useEffect(() => {
        setVerses([]);
        setChapterEnd(false);
        loadInitialVerses().then((_) => {

            })
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
                        Object.keys(verses).sort().map((verseNumber) => {
                            // If there's not already a ref for this verse, create one
                            const parsedVerseNumber = parseInt(verseNumber);
                            if (!verseRefs.current[parsedVerseNumber]) {
                                verseRefs.current[parsedVerseNumber] = React.createRef();
                            }

                            return (
                                <Fragment key={`verse-${verseNumber}`}>
                                    <VerseElement verse={verses[parsedVerseNumber]} ref={verseRefs.current[parsedVerseNumber]} />
                                </Fragment>
                            );
                        })
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
