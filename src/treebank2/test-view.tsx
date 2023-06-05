import { RefObject, createRef, useEffect, useMemo, useState } from 'react';
import { SyntaxGraph } from '../corpus/syntax/syntax-graph';
import { FontService } from '../typography/font-service';
import { Rect, Size } from '../layout/geometry';
import { GraphLayout } from './graph-layout';
import { SVGArabicToken } from './svg-arabic-token';
import { formatLocation } from '../corpus/orthography/location';
import { theme } from '../theme/theme';
import { container } from 'tsyringe';
import './test-view.scss';

type Props = {
    syntaxGraph: SyntaxGraph
}

const createBox = (ref: RefObject<SVGGraphicsElement>): Rect => {
    const element = ref.current;
    const { x = 0, y = 0, width = 0, height = 0 } = element ? element.getBBox() : {};
    return { x, y, width, height };
}

const layoutGraph = (syntaxGraph: SyntaxGraph, tokenRef: RefObject<SVGTextElement>): GraphLayout => {
    const box = createBox(tokenRef);
    box.x = 0;
    box.y = 0;
    return {
        wordLayouts: syntaxGraph.words.map(_ => ({
            bounds: { x: 0, y: 0, width: 0, height: 0 },
            location: { x: 0, y: 0, width: 0, height: 0 },
            phonetic: { x: 0, y: 0, width: 0, height: 0 },
            translation: { x: 0, y: 0, width: 0, height: 0 },
            token: box,
            nodeCircles: [],
            posTags: []
        })),
        phraseLayouts: [],
        edgeLabels: [],
        arcs: [],
        arrows: [],
        containerSize: {
            width: 0,
            height: 0
        }
    };
}

export const TestView = ({ syntaxGraph }: Props) => {
    const fontService = container.resolve(FontService);

    const tokenRef = useMemo(() => createRef<SVGTextElement>(), [syntaxGraph]);

    const [graphLayout, setGraphLayout] = useState<GraphLayout>({
        wordLayouts: [],
        phraseLayouts: [],
        edgeLabels: [],
        arcs: [],
        arrows: [],
        containerSize: {
            width: 0,
            height: 0
        }
    });


    const word = syntaxGraph.words[syntaxGraph.words.length - 2];
    const token = word.token!;

    const defaultArabicFont = theme.fonts.defaultArabicFont;
    const defaultArabicFontMetrics = fontService.getFontMetrics(defaultArabicFont);
    const { syntaxGraphTokenFontSize } = theme;

    useEffect(() => {
        (async () => {
            setGraphLayout(layoutGraph(syntaxGraph, tokenRef));
        })();
    }, [syntaxGraph])

    const containerSize: Size = { width: 150, height: 150 };

    return (
        <div className='test-view'>
            {formatLocation(token.location)}
            <svg
                width={containerSize.width}
                height={containerSize.height}
                viewBox={`0 0 ${containerSize.width} ${containerSize.height}`}>
                <SVGArabicToken
                    ref={tokenRef}
                    token={token}
                    font={defaultArabicFont}
                    fontSize={syntaxGraphTokenFontSize}
                    fontMetrics={defaultArabicFontMetrics}
                    box={graphLayout.wordLayouts.length > 0 ? graphLayout.wordLayouts[graphLayout.wordLayouts.length - 2].token : undefined}
                    fade={false} />
            </svg>
        </div>
    )
}