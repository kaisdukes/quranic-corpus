import { RefObject } from 'react';

export type SVGDom = {
    locationRefs: RefObject<SVGTextElement>[],
    phoneticRefs: RefObject<SVGTextElement>[],
    translationRefs: RefObject<SVGTextElement>[],
    tokenRefs: RefObject<SVGTextElement>[],
    posTagRefs: RefObject<SVGTextElement>[]
}