import { ApiBase } from '../../app/api-base';
import { ArabicTextService } from '../../arabic/arabic-text-service';
import { Graph, SyntaxGraph } from './syntax-graph';
import { Edge } from './edge';
import { DependencyTag } from './dependency-tag';
import { GraphLocation } from './graph-location';
import { formatLocation } from '../orthography/location';
import { singleton } from 'tsyringe';
import axios from 'axios';

@singleton()
export class SyntaxService extends ApiBase {
    private arabicTerms: Map<DependencyTag, string> = new Map([
        ['adj', 'صفة'],
        ['amd', 'استدراك'],
        ['ans', 'جواب'],
        ['app', 'بدل'],
        ['avr', 'ردع'],
        ['caus', 'سببية'],
        ['cert', 'تحقيق'],
        ['circ', 'حال'],
        ['cog', 'مفعول مطلق'],
        ['com', 'مفعول معه'],
        ['cond', 'شرط'],
        ['conj', 'معطوف'],
        ['cpnd', 'مركب'],
        ['emph', 'توكيد'],
        ['eq', 'تسوية'],
        ['exh', 'تحضيض'],
        ['exl', 'تفصيل'],
        ['exp', 'مستثني'],
        ['fut', 'استقبال'],
        ['gen', 'مجرور'],
        ['impv', 'أمر'],
        ['imrs', 'جواب أمر'],
        ['inc', 'ابتداء'],
        ['int', 'تفسير'],
        ['intg', 'استفهام'],
        ['link', 'متعلق'],
        ['neg', 'نفي'],
        ['obj', 'مفعول به'],
        ['pass', 'نائب فاعل'],
        ['poss', 'مضاف إليه'],
        ['pred', 'خبر'],
        ['prev', 'كاف'],
        ['pro', 'نهي'],
        ['prp', 'مفعول لأجله'],
        ['res', 'حصر'],
        ['ret', 'اضراب'],
        ['rslt', 'جواب شرط'],
        ['spec', 'تمييز'],
        ['sub', 'صلة'],
        ['subj', 'فاعل'],
        ['sup', 'زائد'],
        ['sur', 'فجاءة'],
        ['voc', 'منادي']
    ]);

    private readonly subject = 'اسم';
    private readonly predicate = 'خبر';

    constructor(private readonly arabicTextService: ArabicTextService) {
        super();
    }

    async getSyntax(graphLocation: GraphLocation) {
        const response = await axios.get(
            this.url('/syntax'),
            {
                params: {
                    location: formatLocation(graphLocation.location),
                    graph: graphLocation.graphNumber
                }
            });

        const graph = response.data as Graph;
        const { words, edges } = graph;
        const segmentNodeCount = words.reduce((sum, word) => sum + word.endNode - word.startNode + 1, 0);
        const edgeLabels = edges ? edges.map(edge => this.getEdgeLabel(graph, edge, segmentNodeCount)) : [];
        return new SyntaxGraph(graph, edgeLabels, segmentNodeCount);
    }

    private getEdgeLabel(graph: Graph, edge: Edge, segmentNodeCount: number) {
        const { dependencyTag, endNode: headNode } = edge;
        if (dependencyTag !== 'subjx' && dependencyTag !== 'predx') {
            return this.arabicTerms.get(dependencyTag) || '?';
        }

        const name = dependencyTag === 'subjx' ? this.subject : this.predicate;
        const isPhraseNode = headNode >= segmentNodeCount;
        if (isPhraseNode) return name;

        for (const word of graph.words) {
            if (headNode <= word.endNode) {
                const token = word.token;
                if (token != null) {
                    const arabic = token.segments[headNode - word.startNode].arabic;
                    if (arabic) {
                        return `${name} «${this.arabicTextService.removeDiacritics(arabic)}»`;
                    }
                }
            }
        }

        return name;
    }
}