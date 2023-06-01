import { Ref, forwardRef } from 'react';
import { DependencyTag } from '../corpus/syntax/dependency-tag';
import { Position, positionElement } from '../layout/geometry';
import { SyntaxService } from '../corpus/syntax/syntax-service';
import { ColorService } from '../theme/color-service';
import { container } from 'tsyringe';
import './edge-label.scss';

type Props = {
    dependencyTag: DependencyTag,
    position?: Position
}

export const EdgeLabel = forwardRef(({ dependencyTag, position }: Props, ref: Ref<HTMLDivElement>) => {
    const syntaxService = container.resolve(SyntaxService);
    const colorService = container.resolve(ColorService);
    return (
        <div
            ref={ref}
            className={`edge-label ${colorService.getDependencyColor(dependencyTag)}`}
            style={positionElement(position)}>
            {syntaxService.getArabicTerm(dependencyTag)}
        </div>
    )
})