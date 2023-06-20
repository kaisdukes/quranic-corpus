import { Edge } from './edge';
import { Location } from '../orthography/location'
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

    brackets(word: Word) {
        return word.type === 'reference' || (word.type === 'elided' && word.elidedText);
    }

    isPhraseNode(node: number) {
        return node >= this.segmentNodeCount;
    }

    getPhraseNode(node: number): PhraseNode {
        return this.phraseNodes![node - this.segmentNodeCount];
    }

    getTokenRange(): { from: Location; to: Location } | undefined {
        let from: Location | undefined = undefined;
        let to: Location | undefined = undefined;

        for (const word of this.words) {
            const token = word.token;
            if (token && word.type !== 'reference') {
                to = token.location;
                if (!from) {
                    from = token.location;
                }
            }
        }

        return from && to ? { from, to } : undefined;
    }
}