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
    const { location } = params;
    return parseLocation(location!);
}

export const WordByWord = () => {
    const location = useLoaderData() as Location;
    const [chapterNumber, verseNumber] = location;
    const chapterService = container.resolve(ChapterService);
    const chapter = chapterService.getChapter(chapterNumber);

    const [verses, setVerses] = useState<Verse[]>([]);
    const loadingRef = useRef<HTMLDivElement>(null);
    const isLoadingRef = useRef<boolean>(false);
    const morphologyService = container.resolve(MorphologyService);
    const [loading, setLoading] = useState(false);
    const [chapterEnd, setChapterEnd] = useState(false);
    const { readerSettings } = useReaderSettings();
    const { readerMode } = readerSettings;

    const loadVerses = async (startVerseNumber: number) => {
        if (isLoadingRef.current) return;

        isLoadingRef.current = true;
        setLoading(true);

        console.log('LOADING VERSE ' + startVerseNumber);
        const newVerses = await morphologyService.getMorphology([chapterNumber, startVerseNumber], readerMode ? 10 : 5);
        if (newVerses.length > 0) {
            setVerses(prevVerses => [...prevVerses, ...newVerses]);
        } else {
            setChapterEnd(true);
        }

        isLoadingRef.current = false;
        setLoading(false);
    };

    useEffect(() => {
        setVerses([]);
        setChapterEnd(false);
        loadVerses(1);
    }, [chapterNumber]);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !isLoadingRef.current && !chapterEnd) {
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

    const handleTokenClick = (token: Token) => {
        const root = token.root;
        if (!root) return;
        const location = formatLocationWithBrackets(token.location);
        const url = `https://corpus.quran.com/qurandictionary.jsp?q=${root}#${location}`;
        window.open(url, '_blank');
    }

    return (
        <NavigationContainer header={<NavigationHeader chapterNumber={chapterNumber} />}>
            <div className='word-by-word'>
                <div className='word-by-word-view'>
                    <ChapterHeader chapter={chapter} />
                    <Bismillah className='bismillah' />
                    {
                        readerMode
                            ? <ReaderView verses={verses} onClickToken={handleTokenClick} />
                            : verses.map((verse, i) => (
                                <Fragment key={`verse-${i}`}>
                                    <VerseElement verse={verse} onClickToken={handleTokenClick} />
                                </Fragment>
                            ))
                    }
                </div>
                <div className='loading'>
                    {loading && 'Loading...'}
                </div>
                <Footer ref={loadingRef} />
            </div>
        </NavigationContainer>
    )
}