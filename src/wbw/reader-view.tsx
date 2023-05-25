import { Fragment } from 'react';
import { Token } from '../corpus/orthography/token';
import { Verse } from '../corpus/orthography/verse'
import { ReaderToken } from './reader-token';
import { EndOfVerse } from '../treebank/end-of-verse';
import './reader-view.scss';

type Props = {
    verses: Verse[],
    onClickToken: (token: Token) => void
}

export const ReaderView = ({ verses, onClickToken }: Props) => (
    <div className='reader-view'>
        {
            verses.map((verse, verseIndex) => (
                <Fragment key={`verse-${verseIndex}`}>
                    {
                        verse.tokens.map((token, tokenIndex) => (
                            <ReaderToken
                                key={`verse-${verseIndex}-token-${tokenIndex}`}
                                token={token}
                                onClick={() => onClickToken(token)} />
                        ))}
                    <EndOfVerse verseNumber={verse.location[1]} />
                </Fragment>
            ))
        }
    </div>
)