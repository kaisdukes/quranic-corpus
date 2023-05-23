import React, {forwardRef} from 'react'
import { arabicNumber } from '../arabic/arabic-number';
import { formatLocation } from '../corpus/location';
import { Verse } from '../corpus/orthography/verse';
import { TokenElement } from './token-element';
import './verse-element.scss';

type Props = {
    verse: Verse;
};

const VerseElement: React.ForwardRefRenderFunction<HTMLDivElement, Props> = (
    { verse },
    ref
) => {
    const { location, tokens } = verse;
    return (
        <div className='verse-element' ref={ref}>
            <div className='verse-number'>{location[1]}</div>
            <div className='tokens'>
                {
                    tokens.map((token, i) => (
                        <TokenElement
                            key={`token-${i}`}
                            token={token} />
                    ))
                }
                <div className='end-of-verse brown'>{arabicNumber(location[1])}</div>
            </div>
        </div>
    )
}

export default forwardRef<HTMLDivElement, Props>(VerseElement);