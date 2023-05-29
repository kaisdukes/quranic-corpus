import { Ref, forwardRef } from 'react';
import './node-tag.scss';

type Props = {
    className: string,
    tag: string
}

export const NodeTag = forwardRef(({ className, tag }: Props, ref: Ref<HTMLDivElement>) => {
    return (
        <div className={`node-tag ${className}`}>
            <div ref={ref} className='node-circle' />
            <div>{tag}</div>
        </div>
    )
})