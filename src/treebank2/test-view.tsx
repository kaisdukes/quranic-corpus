import { RefObject, createRef, useEffect, useMemo, useState } from 'react';
import { SyntaxGraph } from '../corpus/syntax/syntax-graph';
import { FontService } from '../typography/font-service';
import { Rect } from '../layout/geometry';
import { SVGArabicToken } from './svg-arabic-token';
import { formatLocation } from '../corpus/orthography/location';
import { theme } from '../theme/theme';
import { container } from 'tsyringe';
import './test-view.scss';

type Props = {
    syntaxGraph: SyntaxGraph
}

type Layout = {
    box?: Rect
}

const createBox = (ref: RefObject<SVGGraphicsElement>): Rect => {
    const element = ref.current;
    const { x = 0, y = 0, width = 0, height = 0 } = element ? element.getBBox() : {};
    return { x, y, width, height };
}

const generateLayout = (tokenRef: RefObject<SVGTextElement>): Layout => {
    const box = createBox(tokenRef);
    box.x = 0;
    box.y = 0;
    return { box }
}

export const TestView = ({ syntaxGraph }: Props) => {
    const fontService = container.resolve(FontService);

    const tokenRef = useMemo(() => createRef<SVGTextElement>(), [syntaxGraph]);

    const [layout, setLayout] = useState<Layout>({});

    const word = syntaxGraph.words[syntaxGraph.words.length - 2];
    const token = word.token!;

    const defaultArabicFont = theme.fonts.defaultArabicFont;
    const defaultArabicFontMetrics = fontService.getFontMetrics(defaultArabicFont);
    const { syntaxGraphTokenFontSize } = theme;

    useEffect(() => {
        (async () => {
            setLayout(generateLayout(tokenRef));
        })();
    }, [syntaxGraph])

    return (
        <div className='test-view'>
            {formatLocation(token.location)}
            <svg width={150} height={150}>
                <SVGArabicToken
                    ref={tokenRef}
                    token={token}
                    font={defaultArabicFont}
                    fontSize={syntaxGraphTokenFontSize}
                    fontMetrics={defaultArabicFontMetrics}
                    box={layout.box}
                    fade={false} />
            </svg>
        </div>
    )
}