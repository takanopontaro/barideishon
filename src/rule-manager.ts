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
    RuleManager.rule[ruleClass.name] = ruleClass;
  }

  static get(name: string) {
    return RuleManager.rule[name];
  }
}
