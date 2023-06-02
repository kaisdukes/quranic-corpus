import { Edge } from './edge';
import { GraphLocation } from './graph-location';
import { PhraseNode } from './phrase-node';
import { Word } from './word';

export type Graph = {
    graphNumber: number,
    graphCount: number,
    legacyCorpusGraphNumber: number,
    prev?: GraphLocation,
    next?: GraphLocation,
    words: Word[],
    edges: Edge[],
    phraseNodes?: PhraseNode[]
}

export class SyntaxGraph {
    readonly graphNumber: number;
    readonly graphCount: number;
    readonly legacyCorpusGraphNumber: number;
    readonly prev?: GraphLocation;
    readonly next?: GraphLocation;
    readonly words: Word[];
    readonly edges?: Edge[];
    readonly phraseNodes?: PhraseNode[];

    constructor(
        { graphNumber, graphCount, legacyCorpusGraphNumber, prev, next, words, edges, phraseNodes }: Graph,
        readonly edgeLabels: string[],
        readonly segmentNodeCount: number) {

        this.graphNumber = graphNumber;
        this.graphCount = graphCount;
        this.legacyCorpusGraphNumber = legacyCorpusGraphNumber;
        this.prev = prev;
        this.next = next;
        this.words = words;
        this.edges = edges;
        this.phraseNodes = phraseNodes;
    }

    isPhraseNode(node: number) {
        return node >= this.segmentNodeCount;
    }

    getPhraseNode(node: number): PhraseNode {
        return this.phraseNodes![node - this.segmentNodeCount];
    }
}