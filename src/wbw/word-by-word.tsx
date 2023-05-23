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

    const updateVerses = async (start: number, increment: number) => {
        console.log(`Loading verses ${start}:${start + increment}`)
        const newVerses = await morphologyService.getMorphology([parsedChapterNumber, start], increment);
        if (newVerses.length > 0) {
            let verseDict = { ...verseState.verses };
            for (let i = 0; i < newVerses.length; i++) {
                verseDict[start + i] = newVerses[i];
            }
            return verseDict;
        }
        return null;
    }

    const loadInitialVerses = async () => {
        loading.current = true;
        const startVerse = Math.max(1, parsedVerseNumber - 2);
        const verseDict = await updateVerses(startVerse, 5);
        if (verseDict) {
            setVerseState({
                ...verseState,
                verses: verseDict,
                startVerse: Math.max(parsedVerseNumber - 2, 0),
                endVerse: startVerse + 5,
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
        const verseDict = await updateVerses(verseState.endVerse, 5);
        if (verseDict) {
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
        loading.current = true;
        const _oldStartVerse = verseState.startVerse;
        const _oldEndVerse = verseState.endVerse;
        const verseDict = await updateVerses(Math.max(1, verseState.startVerse - 5), 5);
        if (verseDict) {
            setVerseState({
                ...verseState,
                verses: verseDict,
                startVerse: Math.max(0, _oldStartVerse - 5),
                endVerse: _oldEndVerse,
                stickyVerse: _oldStartVerse
            })
            loading.current = false;
        } else {
            console.log("Reached start of Chapter")
            setVerseState({
                ...verseState,
                startVerse: 0
            })
            loading.current = false;
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
                    <div style={{height: window.innerHeight - 600}}></div>
                    {
                        chapterEnd ?
                            <div>
                                {
                                    parsedChapterNumber > 1 ?
                                        <a href={`/${parsedChapterNumber - 1}/1`}>previous chapter {parsedChapterNumber - 1}</a> :
                                        <></>
                                }
                                <p>You have reached the end of the chapter</p>
                                <a href={`/${parsedChapterNumber + 1}/1`} >next chapter {parsedChapterNumber + 1}</a>
                            </div> :
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
