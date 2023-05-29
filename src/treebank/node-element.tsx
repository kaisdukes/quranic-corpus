import { Ref, forwardRef } from 'react';
import './node-element.scss';

type Props = {
    className: string,
    tag: string
}

export const NodeElement = forwardRef(({ className, tag }: Props, ref: Ref<HTMLDivElement>) => {
    return (
        <div ref={ref} className={`node-element ${className}`}>
            <div className='node-circle' />
            <div>{tag}</div>
        </div>
    )
})