import { RuleClass } from './types';
import { Equal } from './rule/equal';
import { Different } from './rule/different';
import { Within } from './rule/within';

export class RuleManager {
  static rule: { [key: string]: RuleClass } = {
    equal: Equal,
    different: Different,
    within: Within,
  };

  static add(ruleClass: RuleClass) {
    const name = ruleClass.name.replace(/^./, s => s.toLowerCase());
    RuleManager.rule[name] = ruleClass;
  }

  static get(name: string) {
    return RuleManager.rule[name];
  }
}
