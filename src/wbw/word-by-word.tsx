import { useEffect, useRef, useState } from 'react';
import { LoaderFunctionArgs, useLoaderData, useLocation } from 'react-router-dom';
import { Workspace } from '../app/workspace';
import { ChapterService } from '../corpus/orthography/chapter-service';
import { MorphologyService } from '../corpus/morphology/morphology-service';
import { Verse } from '../corpus/orthography/verse';
import { Location, parseHashLocation, parseLocation } from '../corpus/orthography/location';
import { ReactComponent as Bismillah } from '../images/bismillah.svg';
import { ReaderView } from './reader-view';
import { DetailView } from './detail-view';
import { useSettings } from '../settings/settings-context';
import { ChapterHeader } from './chapter-header';
import { CorpusHeader } from '../components/corpus-header';
import { CorpusError } from '../errors/corpus-error';
import { LoadingBanner } from '../components/loading-banner';
import { TokenPane } from './token-pane';
import { getVerseId } from './verse-id';
import { container } from 'tsyringe';
import './word-by-word.scss';

export const wordByWordLoader = ({ params }: LoaderFunctionArgs) => {
    const location = parseLocation(params.location!);
    if (isNaN(location[0])) {
        throw new CorpusError('404', 'Page not found');
    }
    return location.length === 1 ? [location[0], 1] : location;
}

const buildMorphologyQuery = (up: boolean, urlVerseNumber: number, verses: Verse[]) => {
    let verseCount = 10;
    let start: number;
    if (verses.length === 0) {
        start = urlVerseNumber;
    } else if (up) {
        const first = verses[0].location[1];
        start = Math.max(1, first - verseCount);
        if (start < first) {
            verseCount = first - start;
        }
    } else {
        start = verses[verses.length - 1].location[1] + 1;
    }
    return { start, verseCount };
}

const intersectionOptions = {
    rootMargin: '0px',
    threshold: 0.1
}

type ScrollTarget = {
    verseNumber: number
}

export const WordByWord = () => {

    // navigation
    const location = useLoaderData() as Location;
    const [chapterNumber, verseNumber] = location;
    const { hash } = useLocation();
    const hashLocation = parseHashLocation(hash);

    // services
    const chapterService = container.resolve(ChapterService);
    const morphologyService = container.resolve(MorphologyService);
    const chapter = chapterService.getChapter(chapterNumber);

    // state
    const [verses, setVerses] = useState<Verse[]>([]);
    const [scrollTarget, setScrollTarget] = useState<ScrollTarget>();
    const [loadingTop, setLoadingTop] = useState(false);
    const [loadingBottom, setLoadingBottom] = useState(false);
    const [startComplete, setStartComplete] = useState(false);
    const [endComplete, setEndComplete] = useState(false);
    const { settings } = useSettings();
    const { readerMode, translations } = settings;
    const [isScrollingUp, setIsScrollingUp] = useState(false);

    // refs
    const loadingRefTop = useRef<HTMLDivElement>(null);
    const loadingRefBottom = useRef<HTMLDivElement>(null);
    const isLoadingRef = useRef<boolean>(false);

    const loadVerses = async (up: boolean, verses: Verse[]) => {
        if (isLoadingRef.current) return;
        isLoadingRef.current = true;

        console.log(`Loading verses: direction = ${up ? 'up' : 'down'}`);
        if (up) {
            setLoadingTop(true);
        } else {
            setLoadingBottom(true);
        }

        const { start, verseCount } = buildMorphologyQuery(up, verseNumber, verses);
        console.log(`    loading verse ${chapterNumber}:${start} (n = ${verseCount})`);
        const loadedVerses = await morphologyService.getMorphology([chapterNumber, start], verseCount, translations);
        const newVerses = up ? [...loadedVerses, ...verses] : [...verses, ...loadedVerses];
        setVerses(newVerses);
        setScrollTarget(
            up
                ? verses.length > 0 ? { verseNumber: verses[0].location[1] - 1 } : undefined
                : undefined
        );

        if (newVerses[0].location[1] === 1) {
            if (!startComplete) console.log('    start complete');
            setStartComplete(true);
        }

        if (newVerses[newVerses.length - 1].location[1] === chapter.verseCount) {
            if (!endComplete) console.log('    end complete');
            setEndComplete(true);
        }

        isLoadingRef.current = false;
        if (up) {
            setLoadingTop(false);
        } else {
            setLoadingBottom(false);
        }
        console.log('    done');
    };

    useEffect(() => {
        setVerses([]);
        setStartComplete(false);
        setEndComplete(false);
        loadVerses(false, []); // avoid stale state
    }, [chapterNumber, verseNumber, translations]);

    useEffect(() => {
        if (!scrollTarget) return;
        const { verseNumber } = scrollTarget;
        let targetElement = verseNumber === 1
            ? loadingRefTop.current
            : document.querySelector(`#${getVerseId([chapterNumber, verseNumber])}`);
        if (targetElement) {
            console.log(`Scrolling to verse ${verseNumber}`)
            targetElement.scrollIntoView();

            const bodyTop = document.body.getBoundingClientRect().top;
            const elementTop = targetElement.getBoundingClientRect().top;
            window.scrollTo({
                top: elementTop - bodyTop - 50,
                behavior: 'smooth'
            });
        }
    }, [verses, scrollTarget]);

    useEffect(() => {
        const observerTop = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !isLoadingRef.current && !startComplete && isScrollingUp) {
                loadVerses(true, verses);
            }
        }, intersectionOptions);

        const observerBottom = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !isLoadingRef.current && !endComplete) {
                loadVerses(false, verses);
            }
        }, intersectionOptions);

        if (loadingRefTop.current) {
            observerTop.observe(loadingRefTop.current);
        }

        if (loadingRefBottom.current) {
            observerBottom.observe(loadingRefBottom.current);
        }

        return () => {
            if (loadingRefTop.current) {
                observerTop.unobserve(loadingRefTop.current);
            }
            if (loadingRefBottom.current) {
                observerBottom.unobserve(loadingRefBottom.current);
            }
        };
    }, [verses, loadingTop, loadingBottom, startComplete, endComplete, isScrollingUp]);

    useEffect(() => {
        const handleWheelScroll = (event: WheelEvent) => {
            setIsScrollingUp(event.deltaY < 0);
        };

        const handleTouchScroll = (event: TouchEvent) => {
            setIsScrollingUp(event.touches[0].clientY > event.touches[event.touches.length - 1].clientY);
        };

        window.addEventListener('wheel', handleWheelScroll);
        window.addEventListener('touchmove', handleTouchScroll);

        return () => {
            window.removeEventListener('wheel', handleWheelScroll);
            window.removeEventListener('touchmove', handleTouchScroll);
        };
    }, []);

    return (
        <Workspace
            navigation={{ chapterNumber }}
            focusMode={true}
            info={hashLocation && <TokenPane location={hashLocation} />}>
            <div className='word-by-word'>
                <CorpusHeader />
                {loadingTop && <LoadingBanner />}
                <div ref={loadingRefTop} />
                {
                    verses.length > 0 && verses[0].location[1] === 1 &&
                    <>
                        <ChapterHeader chapter={chapter} />
                        <Bismillah className='bismillah' />
                    </>
                }
                {
                    readerMode
                        ? <ReaderView verses={verses} />
                        : <DetailView verses={verses} />
                }
                {loadingBottom && <LoadingBanner />}
                <div ref={loadingRefBottom} />
            </div>
        </Workspace>
    )
}