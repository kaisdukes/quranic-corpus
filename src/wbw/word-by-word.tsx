import { Fragment, useEffect, useRef, useState } from 'react';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import { NavigationContainer } from '../navigation/navigation-container';
import { NavigationHeader } from '../navigation/navigation-header';
import { ChapterService } from '../corpus/orthography/chapter-service';
import { MorphologyService } from '../corpus/morphology/morphology-service';
import { VerseElement } from '../treebank/verse-element';
import { Verse } from '../corpus/orthography/verse';
import { Location } from '../corpus/location';
import { Footer } from '../components/footer';
import { container } from 'tsyringe';
import { ReactComponent as Bismillah } from '../images/bismillah.svg';
import { ReaderView } from './reader-view';
import { useReaderSettings } from '../context/reader-settings-context';
import { ChapterHeader } from './chapter-header';
import { formatLocationWithBrackets, parseLocation } from '../corpus/location';
import { Token } from '../corpus/orthography/token';
import './word-by-word.scss';

export const resolveLocation = ({ params }: LoaderFunctionArgs) => {
    const location = parseLocation(params.location!);
    if (isNaN(location[0])) {
        throw new Error('Page not found');
    }
    return location.length == 1 ? [location[0], 1] : location;
}

export const WordByWord = () => {
    const location = useLoaderData() as Location;
    const [chapterNumber, verseNumber] = location;
    const chapterService = container.resolve(ChapterService);
    const chapter = chapterService.getChapter(chapterNumber);

    const [verses, setVerses] = useState<Verse[]>([]);
    const loadingRefTop = useRef<HTMLDivElement>(null);
    const loadingRefBottom = useRef<HTMLDivElement>(null);
    const isLoadingRef = useRef<boolean>(false);
    const morphologyService = container.resolve(MorphologyService);
    const [loadingTop, setLoadingTop] = useState(false);
    const [loadingBottom, setLoadingBottom] = useState(false);
    const [startComplete, setStartComplete] = useState(false);
    const [endComplete, setEndComplete] = useState(false);
    const { readerSettings } = useReaderSettings();
    const { readerMode } = readerSettings;

    const loadVerses = async (direction: 'up' | 'down') => {
        if (isLoadingRef.current) return;

        isLoadingRef.current = true;
        if (direction === 'up') {
            setLoadingTop(true);
        } else {
            setLoadingBottom(true);
        }

        console.log(`Loading verses: direction = ${direction}`);
        const verseCount = readerMode ? 10 : 5;
        let start: number;
        if (verses.length === 0) {
            start = verseNumber;
        }
        else if (direction === 'up') {
            start = Math.max(1, verses[0].location[1] - verseCount);
        } else {
            start = verses[verses.length - 1].location[1] + 1;
        }
        console.log(`    loading verse ${chapterNumber}:${start}`);

        const loadedVerses = await morphologyService.getMorphology([chapterNumber, start], verseCount);
        const newVerses = direction === 'up' ? [...loadedVerses, ...verses] : [...verses, ...loadedVerses];
        setVerses(newVerses);

        if (newVerses[0].location[1] === 1) {
            setStartComplete(true);
            console.log('    start complete');
        }

        if (newVerses[newVerses.length - 1].location[1] === chapter.verseCount) {
            setEndComplete(true);
            console.log('    end complete');
        }

        isLoadingRef.current = false;
        if (direction === 'up') {
            setLoadingTop(false);
        } else {
            setLoadingBottom(false);
        }
    };

    useEffect(() => {
        setVerses([]);
        setStartComplete(false);
        setEndComplete(false);
        loadVerses('down');
    }, [chapterNumber]);

    const versesRef = useRef(verses);
    versesRef.current = verses;
    useEffect(() => {
        const observerTop = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !isLoadingRef.current && !startComplete) {
                console.log('hit intersection top!');
                loadVerses('up');
            }
        }, {
            rootMargin: '0px',
            threshold: 0.1
        });

        const observerBottom = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !isLoadingRef.current && !endComplete) {
                console.log('hit intersection bottom!');
                loadVerses('down');
            }
        }, {
            rootMargin: '0px',
            threshold: 0.1
        });

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
    }, [verses, loadingTop, loadingBottom, startComplete, endComplete]);

    const handleTokenClick = (token: Token) => {
        const root = token.root;
        if (!root) return;
        const location = formatLocationWithBrackets(token.location);
        const url = `https://corpus.quran.com/qurandictionary.jsp?q=${root}#${location}`;
        window.open(url, '_blank');
    }

    if (verses.length > 0) {
        console.log(`    creating JSX from verse ${chapterNumber}:${verses[0].location[1]}`);
    }

    return (
        <NavigationContainer header={<NavigationHeader chapterNumber={chapterNumber} />}>
            <div className='word-by-word'>
                <div className='loading'>
                    {loadingTop && 'Loading...'}
                </div>
                <div ref={loadingRefTop}></div>
                <div className='word-by-word-view'>
                    <ChapterHeader chapter={chapter} />
                    <Bismillah className='bismillah' />
                    {
                        readerMode
                            ? <ReaderView verses={verses} onClickToken={handleTokenClick} />
                            : verses.map((verse, i) => (
                                <Fragment key={`verse-${verse.location[0]}:${verse.location[1]}}`}>
                                    <VerseElement verse={verse} onClickToken={handleTokenClick} />
                                </Fragment>
                            ))
                    }
                </div>
                <div className='loading'>
                    {loadingBottom && 'Loading...'}
                </div>
                <div ref={loadingRefBottom}></div>
                <Footer />
            </div>
        </NavigationContainer>
    )
}