import { ApiBase } from '../../api-base';
import { Graph, SyntaxGraph } from './syntax-graph';
import { DependencyTag } from './dependency-tag';
import { formatLocation, Location } from '../orthography/location';
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
        ['predx', 'null'],
        ['prev', 'كاف'],
        ['pro', 'نهي'],
        ['prp', 'مفعول لأجله'],
        ['res', 'حصر'],
        ['ret', 'اضراب'],
        ['rslt', 'جواب شرط'],
        ['spec', 'تمييز'],
        ['sub', 'صلة'],
        ['subj', 'فاعل'],
        ['subjx', 'null'],
        ['sup', 'زائد'],
        ['sur', 'فجاءة'],
        ['voc', 'منادي']
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