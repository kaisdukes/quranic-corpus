import { Token } from '../corpus/orthography/token';
import { TokenHeader } from './token-header';
import { ArabicToken } from '../arabic/arabic-token';
import { PosTag } from './pos-tag';
import './tagged-token.scss';

type Props = {
    token: Token
}

export const TaggedToken = ({ token }: Props) => {
    const { segments } = token;
    return (
        <div className='tagged-token'>
            <TokenHeader token={token} />
            <ArabicToken token={token} />
            <div className='pos-tags'>
                {
                    (() => {
                        const posTags = [];
                        let j = 0;
                        for (var i = segments.length - 1; i >= 0; i--) {
                            const segment = segments[i];
                            if (segment.posTag !== 'DET') {
                                posTags.push(
                                    <PosTag key={j} segment={segment} />
                                );
                                j++;
                            }
                        }
                        return posTags;
                    })()
                }
            </div>
        </div>
    )
}