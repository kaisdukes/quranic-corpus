import { Token } from '../orthography/token';
import { Edge } from './edge';
import { PhraseNode } from './phrase-node';
import { Word } from './word';

type Props = {
    tokens: Token[],
    edges: Edge[],
    phraseNodes: PhraseNode[]
}

export class SyntaxGraph {
    readonly words: Word[];
    readonly edges: Edge[];
    readonly phraseNodes: PhraseNode[];
    readonly segmentNodeCount: number;

    constructor({ tokens, edges, phraseNodes }: Props) {
        this.words = tokens.map(token => ({ token: token, nodeCount: this.countVisualSegments(token) }));
        this.edges = edges;
        this.phraseNodes = phraseNodes;
        this.segmentNodeCount = this.words.reduce((sum, word) => sum + word.nodeCount, 0);
    }

    isPhraseNode(node: number) {
        return node >= this.segmentNodeCount;
    }

    getPhraseNode(node: number): PhraseNode {
        return this.phraseNodes[node - this.segmentNodeCount];
    }

    private countVisualSegments(token: Token) {
        return token
            .segments
            .filter(segment => segment.posTag !== 'DET')
            .length;
    }
}