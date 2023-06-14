import { WordMorphology } from '../corpus/morphology/word-morphology';
import { TaggedToken } from './tagged-token';
import { CloseButton } from '../components/close-button';
import { MarkupView } from '../components/markup-view';
import { NodeCircle } from './node-circle';
import { useLocation } from 'react-router-dom';
import { ColorService } from '../theme/color-service';
import { container } from 'tsyringe';
import './word-morphology-view.scss';

type Props = {
    wordMorphology: WordMorphology
}

export const WordMorphologyView = ({ wordMorphology }: Props) => {
    const { pathname: url } = useLocation();
    const { token, summary, segmentDescriptions, arabicGrammar } = wordMorphology;
    const { segments } = token;
    const colorService = container.resolve(ColorService);

    return (
        <div className='word-morphology-view'>
            <header>
                <h1>Quranic Grammar</h1>
                <CloseButton url={url} />
            </header>
            <TaggedToken token={token} />
            <section>
                <div className='summary'>
                    <MarkupView markup={summary} />
                </div>
                <div className='descriptions'>
                    {
                        (() => {
                            const descriptions = [];
                            let i = 0;
                            for (const segment of segments) {
                                if (segment.posTag !== 'DET') {
                                    const className = colorService.getSegmentColor(segment);
                                    descriptions.push(
                                        <div key={`description-${i}`} className='segment'>
                                            <NodeCircle className={className} />
                                            <div className='description'>
                                                <strong className={className}>{segment.posTag}</strong> - <MarkupView markup={segmentDescriptions[i++]} />
                                            </div>
                                        </div>
                                    )
                                }
                            }
                            return descriptions;
                        })()
                    }
                </div>
                <div className='grammar'>
                    {
                        arabicGrammar.split('\n').map((line, i) => (
                            <div key={`grammar-${i}`} className='markup'>{line}</div>
                        ))
                    }
                </div>
            </section>
        </div>
    )
}