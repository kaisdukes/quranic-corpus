import { RefObject } from 'react';

export type SVGWordElement = {
    locationRef: RefObject<SVGTextElement>,
    phoneticRef: RefObject<SVGTextElement>,
    translationRef: RefObject<SVGTextElement>,
    braRef?: RefObject<SVGTextElement>,
    tokenRef: RefObject<SVGTextElement>,
    ketRef?: RefObject<SVGTextElement>,
    posTagRefs: RefObject<SVGTextElement>[]
}

export type SVGDom = {
    wordElements: SVGWordElement[],
    phraseTagRefs: RefObject<SVGTextElement>[],
    dependencyTagRefs: RefObject<SVGTextElement>[]
}