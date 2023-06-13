import { Segment } from '../corpus/morphology/segment';
import { ColorService } from '../theme/color-service';
import { combineClassNames } from '../theme/class-names';
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
            <div className={combineClassNames('node-circle', className)} />
            <div className={className}>{segment.posTag}</div>
        </div>
    )
}