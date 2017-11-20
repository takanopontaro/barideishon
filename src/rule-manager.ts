import { Equal } from './rule/equal';
import { Different } from './rule/different';
import { Within } from './rule/within';

export class RuleManager {
  static rule: { [key: string]: any } = {
    equal: Equal,
    different: Different,
    within: Within,
  };

  static add(ruleClass: any) {
    const name = ruleClass.name.replace(/^./, (s: string) => s.toLowerCase());
    RuleManager.rule[name] = ruleClass;
  }

  static get(name: string) {
    return RuleManager.rule[name];
  }
}
