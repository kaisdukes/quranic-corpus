import { MorphologyService } from '../corpus/morphology/morphology-service';
import { TokenElement } from '../treebank/token-element';
import { container } from 'tsyringe';
import './word-by-word-view.scss';

export const WordByWordView = () => {

    var tokens = container
        .resolve(MorphologyService)
        .getMorphology();

    return (
        <div className='word-by-word-view'>
            {
                tokens.map((token, i) => (
                    <TokenElement
                        key={`token-${i}`}
                        token={token} />
                ))
            }
        </div>
    )
}