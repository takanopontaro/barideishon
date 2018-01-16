import { RuleClass } from './types';
import { Equal } from './rule/equal';
import { Different } from './rule/different';
import { Within } from './rule/within';

class RuleManager {
  private static rule: { [key: string]: RuleClass } = {};

  static add(name: string, ruleClass: RuleClass) {
    RuleManager.rule[name] = ruleClass;
  }

  static get(name: string) {
    return RuleManager.rule[name];
  }
}

RuleManager.add('equal', Equal);
RuleManager.add('different', Different);
RuleManager.add('within', Within);

export { RuleManager };
