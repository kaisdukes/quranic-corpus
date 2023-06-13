import { Fragment } from 'react';
import { Verse } from '../corpus/orthography/verse'
import { ReaderToken } from './reader-token';
import { SectionMark } from '../components/section-mark';
import { SajdahMark } from '../components/sajdah-mark';
import { EndOfVerse } from '../components/end-of-verse';
import './reader-view.scss';

type Props = {
    verses: Verse[]
}

export const ReaderView = ({ verses }: Props) => {
    return (
        <div className='reader-view'>
            {
                verses.map(verse => {
                    const { location, tokens, verseMark } = verse;
                    return (
                        <Fragment key={`verse-${location[0]}:${location[1]}}`}>
                            {verseMark === 'section' && <SectionMark />}
                            {
                                tokens.map((token) => (
                                    <ReaderToken
                                        key={`token-${token.location[0]}:${token.location[1]}:${token.location[2]}}}`}
                                        token={token} />
                                ))
                            }
                            {verseMark === 'sajdah' && <SajdahMark />}
                            <EndOfVerse verseNumber={location[1]} />
                        </Fragment>
                    )
                })
            }
        </div>
    )
}