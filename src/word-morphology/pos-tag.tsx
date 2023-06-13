import { Segment } from '../corpus/morphology/segment';
import { ColorService } from '../theme/color-service';
import { NodeCircle } from './node-circle';
import { container } from 'tsyringe';
import './pos-tag.scss';

type Props = {
    segment: Segment
}

export const PosTag = ({ segment }: Props) => {
    const colorService = container.resolve(ColorService);
    const className = colorService.getSegmentColor(segment);
    return (
        <div className='pos-tag'>
            <NodeCircle className={className} />
            <div className={className}>{segment.posTag}</div>
        </div>
    )
}