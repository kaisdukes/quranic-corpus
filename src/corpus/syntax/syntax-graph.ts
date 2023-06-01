import { Edge } from './edge';
import { PhraseNode } from './phrase-node';
import { Word } from './word';

export type Graph = {
    graphNumber: number,
    graphCount: number,
    legacyCorpusGraphNumber: number,
    words: Word[],
    edges: Edge[],
    phraseNodes: PhraseNode[]
}

export class SyntaxGraph {
    readonly graphNumber: number;
    readonly graphCount: number;
    readonly legacyCorpusGraphNumber: number;
    readonly words: Word[];
    readonly edges: Edge[];
    readonly phraseNodes: PhraseNode[];
    readonly segmentNodeCount: number;

    constructor({ graphNumber, graphCount, legacyCorpusGraphNumber, words, edges, phraseNodes }: Graph) {
        this.graphNumber = graphNumber;
        this.graphCount = graphCount;
        this.legacyCorpusGraphNumber = legacyCorpusGraphNumber;
        this.words = words;
        this.edges = edges;
        this.phraseNodes = phraseNodes;
        this.segmentNodeCount = this.words.reduce((sum, word) => sum + word.endNode - word.startNode + 1, 0);
    }

    isPhraseNode(node: number) {
        return node >= this.segmentNodeCount;
    }

    getPhraseNode(node: number): PhraseNode {
        return this.phraseNodes[node - this.segmentNodeCount];
    }
}