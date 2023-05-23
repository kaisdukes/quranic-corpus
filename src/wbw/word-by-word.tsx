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
import {Location} from "../corpus/location";
import {Token} from "../corpus/orthography/token";

type VerseState = {
    startVerse: number,
    endVerse: number,
    stickyVerse: number,
    verses: {[key: number]: Verse},
    verseRefs: {[key: number]: React.RefObject<HTMLDivElement>}
}

export const WordByWord = () => {
    const { chapterNumber, verseNumber } = useParams();
    const parsedChapterNumber = Number(chapterNumber);
    const parsedVerseNumber = Number(verseNumber);

    const chapterService = container.resolve(ChapterService);
    const chapter = chapterService.getChapter(parsedChapterNumber);

    // Since verses can now be fetched bi-directionally we need to store as dictionary so they don't get overwritten.
    const verseRefs = useRef<{[key: number]: React.RefObject<HTMLDivElement>}>({});
    const [verseState, setVerseState] = useState<VerseState>({
        startVerse: parsedVerseNumber - 2,
        endVerse: parsedVerseNumber + 2,
        stickyVerse: parsedVerseNumber,
        verses: {},
        verseRefs: {}
    });

    // Handle the position of the top and bottom references.
    const topLoadingRef = useRef<HTMLDivElement>(null);
    const bottomLoadingRef = useRef<HTMLDivElement>(null);

    const morphologyService = container.resolve(MorphologyService);
    const loading = useRef(false);
    const [chapterEnd, setChapterEnd] = useState(false);

    const loadInitialVerses = async () => {
        loading.current = true;
        const newVerses = await morphologyService.getMorphology([parsedChapterNumber, Math.max(1, parsedVerseNumber - 2)], 5);
        if (newVerses.length > 0) {
            let verseDict = { ...verseState.verses };
            for (let i = 0; i < newVerses.length; i++) {
                verseDict[verseState.startVerse + i] = newVerses[i];
            }
            setVerseState({
                ...verseState,
                verses: verseDict,
                startVerse: Math.max(parsedVerseNumber - 2, 0),
                endVerse: parsedVerseNumber + 2,
            })
            loading.current = false
        } else {
            setChapterEnd(true);
            loading.current = false
        }
    }

    const loadNextVerses = async () => {
        if (loading.current) return;
        loading.current = true;
        const _oldEndVerse = verseState.endVerse;
        console.log("Loading next five verses: ", verseState.endVerse)
        const newVerses = await morphologyService.getMorphology([parsedChapterNumber, verseState.endVerse + 1], 5);
        if (newVerses.length > 0) {
            let verseDict = { ...verseState.verses };
            for (let i = 0; i < newVerses.length; i++) {
                verseDict[verseState.endVerse + i + 1] = newVerses[i];
            }
            setVerseState({
                ...verseState,
                verses: verseDict,
                endVerse: _oldEndVerse + 5,
                stickyVerse: _oldEndVerse
            })
            loading.current = false;

        } else {
            console.log("Reached end of Chapter")
            setChapterEnd(true);
        }
    };


    const loadPreviousVerses = async () => {
        if (verseState.startVerse===0 || loading.current) return;
        const _oldStartVerse = verseState.startVerse;
        const _oldEndVerse = verseState.endVerse;
        loading.current = true;
        console.log("Loading previous five verses: ", verseState.startVerse, Object.keys(verseState.verses))
        const newVerses = await morphologyService.getMorphology([parsedChapterNumber, Math.max(1, verseState.startVerse - 5)], 5);
        loading.current = false;
        if (newVerses.length > 0) {
            let verseDict = { ...verseState.verses };
            for (let i = 0; i < newVerses.length; i++) {
                verseDict[verseState.startVerse - 5 + i] = newVerses[i];
            }

            setVerseState({
                ...verseState,
                verses: verseDict,
                startVerse: Math.max(0, _oldStartVerse - 5),
                endVerse: _oldEndVerse,
                stickyVerse: _oldStartVerse
            })
        } else {
            setVerseState({
                ...verseState,
                startVerse: 0
            })
        }
    };

    // Handle scroll to correct verse. TODO:// fix this so it scrolls into view with offset.
    useEffect(() => {
        if (verseState.verses[verseState.stickyVerse]) {
            verseRefs.current[verseState.stickyVerse].current?.scrollIntoView();
        }
    }, [verseState, parsedVerseNumber]);

    useEffect(() => {
        setChapterEnd(false);
        loadInitialVerses().then((_) => {
            })
    }, [parsedChapterNumber, parsedVerseNumber]);

    useEffect(() => {
        const observerTop = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !loading.current && verseState.startVerse !=0 ) {
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
    }, [verseState, loading.current, chapterEnd]);

    return (
        <NavigationContainer header={<NavigationHeader chapterNumber={parsedChapterNumber} />}>
            <div className='word-by-word'>
                <div className='chapter-header'>
                    <img src={chapter.city === 'Makkah' ? makkah : madinah} />
                    <h1>{parsedChapterNumber}. {formatChapterTitle(chapter)}</h1>
                </div>
                <div className='word-by-word-view'>
                    {verseState.startVerse === 0 ? <></> : <div ref={topLoadingRef}>Loading...</div>}
                    {
                        Object.keys(verseState.verses).map(Number).sort((a, b) => a - b).map((verseNumber) => {
                            // If there's not already a ref for this verse, create one
                            if (!verseRefs.current[verseNumber]) {
                                verseRefs.current[verseNumber] = React.createRef();
                            }

                            return (
                                <Fragment key={`verse-${verseNumber}`}>
                                    <VerseElement verse={verseState.verses[verseNumber]} ref={verseRefs.current[verseNumber]} />
                                </Fragment>
                            );
                        })
                    }
                    {
                        chapterEnd ?
                            <></> :
                            <div ref={loading.current ? null : bottomLoadingRef}>{loading.current ? "loading..." : ""}</div>
                    }

                    {
                        // This is where we return the Error URL
                        chapterEnd && verseState.startVerse == 0 && Object.keys(verseState.verses).length == 0 ?
                             <div>Chapter {parsedChapterNumber} Verse {parsedVerseNumber} not found</div> :
                            <></>
                    }

                </div>
                <Footer />
            </div>
        </NavigationContainer>
    )
}
