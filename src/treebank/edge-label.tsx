import { Ref, forwardRef } from 'react';
import { DependencyTag } from '../corpus/syntax/dependency-tag';
import { Position, positionElement } from '../layout/geometry';
import { DependencyGraphService } from '../corpus/syntax/dependency-graph-service';
import { ColorService } from '../theme/color-service';
import { container } from 'tsyringe';
import './edge-label.scss';

type Props = {
    dependencyTag: DependencyTag,
    position?: Position
}

export const EdgeLabel = forwardRef(({ dependencyTag, position }: Props, ref: Ref<HTMLDivElement>) => {
    const dependencyGraphService = container.resolve(DependencyGraphService);
    const colorService = container.resolve(ColorService);
    return (
        <div
            ref={ref}
            className={`edge-label ${colorService.getDependencyColor(dependencyTag)}`}
            style={positionElement(position)}>
            {dependencyGraphService.getArabicTerm(dependencyTag)}
        </div>
    )
})