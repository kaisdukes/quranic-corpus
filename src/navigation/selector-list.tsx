import { ReactNode } from 'react';
import './selector-list.scss';

type Props = {
    header: string,
    length: number,
    renderItem: (index: number) => ReactNode
}

export const SelectorList = ({ header, length, renderItem }: Props) => {

    return (
        <div className='selector-list'>
            <div className='header'>{header}</div>
            <div className='items'>
                {

                    Array.from({ length }, (_, index) => renderItem(index))
                }
            </div>
        </div>
    )
}