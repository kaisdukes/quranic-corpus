import { ApiBase } from '../../api-base';
import { Graph, SyntaxGraph } from './syntax-graph';
import { DependencyTag } from './dependency-tag';
import { formatLocation, Location } from '../orthography/location';
import { singleton } from 'tsyringe';
import axios from 'axios';

@singleton()
export class SyntaxService extends ApiBase {
    private arabicTerms: Map<DependencyTag, string> = new Map([
        ['circ', 'حال'],
        ['gen', 'مجرور'],
        ['link', 'متعلق'],
        ['obj', 'مفعول به'],
        ['subj', 'فاعل']
    ]);

    async getSyntax(location: Location, graphNumber: number) {
        const response = await axios.get(
            this.url('/syntax'),
            {
                params: {
                    location: formatLocation(location),
                    graph: graphNumber
                }
            });
        return new SyntaxGraph(response.data as Graph);
    }

    getArabicTerm(dependencyTag: DependencyTag): string {
        return this.arabicTerms.get(dependencyTag) || '?';
    }
}