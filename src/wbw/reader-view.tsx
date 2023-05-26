import { Fragment } from 'react';
import { Token } from '../corpus/orthography/token';
import { Verse } from '../corpus/orthography/verse'
import { ReaderToken } from './reader-token';
import { EndOfVerse } from '../components/end-of-verse';
import './reader-view.scss';

type Props = {
    verses: Verse[],
    onClickToken: (token: Token) => void
}

export const ReaderView = ({ verses, onClickToken }: Props) => (
    <div className='reader-view'>
        {
            verses.map(verse => (
                <Fragment key={`verse-${verse.location[0]}:${verse.location[1]}}`}>
                    {
                        verse.tokens.map((token) => (
                            <ReaderToken
                                key={`token-${token.location[0]}:${token.location[1]}:${token.location[2]}}}`}
                                token={token}
                                onClick={() => onClickToken(token)} />
                        ))}
                    <EndOfVerse verseNumber={verse.location[1]} />
                </Fragment>
            ))
        }
    </div>
)