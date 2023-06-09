import { Advisor } from '../../../../src/advisor';
import { builtInRules, RuleConfig, RuleModule, getChartRule } from '../../../../src/advisor/ruler';

const myRule: RuleModule = {
  id: 'fufu-rule',
  type: 'HARD',
  docs: {
    lintText: 'listen to fufu',
  },
  trigger: (args) => {
    const { chartType } = args;
    return ['pie_chart'].indexOf(chartType) !== -1;
  },
  validator: (args) => {
    let result = 1;
    const { dataProps } = args;
    if (dataProps.length > 1) {
      result = 0;
    }
    return result;
  },
};

const ruleWithExtra: RuleModule = {
  id: 'shushu-rule',
  type: 'SOFT',
  docs: {
    lintText: 'listen to shushu',
  },
  option: {
    off: false,
    weight: 0.5,
    extra: {
      name: 'ShuShu',
      level: 99,
    },
  },
  trigger: (args) => {
    const { chartType, weight } = args;
    return ['pie_chart'].indexOf(chartType) !== -1 && weight > 0;
  },
  validator: (args) => {
    let result = 0;
    const { name, level } = args;
    if (name === 'ShuShu' && level > 50) {
      result = 1;
    }
    return result;
  },
};

describe('init Ruler', () => {
  test('rule amount', () => {
    const rules = builtInRules;
    expect(rules.length).toBe(13);
  });
});

describe('customized Rule', () => {
  test('no rule Config', () => {
    const myAdvisor = new Advisor();
    const { ruleBase } = myAdvisor;
    expect(Object.keys(ruleBase).length).toBe(13);
  });

  test('exclude rule', () => {
    const myRuleCfg: RuleConfig = {
      exclude: ['bar-series-qty', 'diff-pie-sector'],
    };
    const myAdvisor = new Advisor({ ruleCfg: myRuleCfg });
    const { ruleBase } = myAdvisor;
    expect(Object.keys(ruleBase).length).toBe(11);
  });

  test('include rule', () => {
    const myRuleCfg: RuleConfig = {
      include: ['bar-series-qty', 'diff-pie-sector'],
    };
    const myAdvisor = new Advisor({ ruleCfg: myRuleCfg });
    const { ruleBase } = myAdvisor;
    expect(Object.keys(ruleBase).length).toBe(2);
  });

  test('exclude and include rule', () => {
    const myRuleCfg: RuleConfig = {
      exclude: ['bar-series-qty'],
      include: ['bar-series-qty', 'diff-pie-sector'],
    };
    const myAdvisor = new Advisor({ ruleCfg: myRuleCfg });
    const { ruleBase } = myAdvisor;
    expect(Object.keys(ruleBase).length).toBe(1);
  });

  test('custom rule', () => {
    const myRuleCfg: RuleConfig = {
      include: ['bar-series-qty'],
      custom: {
        'fufu-rule': myRule,
      },
    };
    const myAdvisor = new Advisor({ ruleCfg: myRuleCfg });
    const { ruleBase } = myAdvisor;
    expect(Object.keys(ruleBase).length).toBe(2);
  });

  test('override rule', () => {
    const myRuleCfg: RuleConfig = {
      custom: {
        'data-check': {
          ...(getChartRule('data-check') as RuleModule),
          docs: {
            lintText: 'Now is my rule!',
          },
        },
      },
    };
    const myAdvisor = new Advisor({ ruleCfg: myRuleCfg });
    const { ruleBase } = myAdvisor;
    expect(ruleBase?.['data-check']?.docs.lintText).toBe('Now is my rule!');
  });

  test('custom rule with option', () => {
    const myRuleCfg: RuleConfig = {
      include: ['data-check', 'diff-pie-sector'],
      options: {
        'data-check': {
          off: true,
          weight: 100,
        },
      },
    };
    const myAdvisor = new Advisor({ ruleCfg: myRuleCfg });
    const { ruleBase } = myAdvisor;
    expect(ruleBase?.['data-check']?.option?.off).toBe(true);
  });

  test('customized rule with option and extra', () => {
    const myRuleCfg: RuleConfig = {
      custom: {
        'shushu-rule': ruleWithExtra,
      },
    };
    const myAdvisor = new Advisor({ ruleCfg: myRuleCfg });
    const { ruleBase } = myAdvisor;
    expect(ruleBase['shushu-rule'].option?.extra).toHaveProperty(['name'], 'ShuShu');
  });
});
