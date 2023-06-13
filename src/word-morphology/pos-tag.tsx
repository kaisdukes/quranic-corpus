import { Segment } from '../corpus/morphology/segment';
import './pos-tag.scss';

type Props = {
    segment: Segment
}

export const PosTag = ({ segment }: Props) => {
    return (
        <div className='pos-tag'>
            {segment.posTag}
        </div>
    )
}