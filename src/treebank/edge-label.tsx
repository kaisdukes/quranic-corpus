import { Ref, forwardRef } from 'react';
import { DependencyTag } from '../corpus/syntax/dependency-tag';
import { Position, positionElement } from '../layout/geometry';
import { ColorService } from '../theme/color-service';
import { container } from 'tsyringe';
import './edge-label.scss';

type Props = {
    dependencyTag: DependencyTag,
    label: string,
    position?: Position
}

export const EdgeLabel = forwardRef(({ dependencyTag, label, position }: Props, ref: Ref<HTMLDivElement>) => {
    const colorService = container.resolve(ColorService);
    return (
        <div
            ref={ref}
            className={`edge-label ${colorService.getDependencyColor(dependencyTag)}`}
            style={positionElement(position)}>
            {label}
        </div>
    )
})