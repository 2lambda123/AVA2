import { Advisor } from '../src/advisor';
import { builtInRules, RuleConfig, RuleModule, getChartRule } from '../src/ruler';

const toyData = [
  { name: 'Alice', age: 19 },
  { name: 'Becky', age: 18 },
  { name: 'Cathy', age: 24 },
];

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

const myRule2: RuleModule = {
  id: 'check-blocked-users',
  type: 'HARD',
  docs: {
    lintText: 'No chart recommendation for blocked users.',
  },
  option: {
    off: false,
    customTriggerArgs: {
      userId: '001',
      checkUserPermission: (userId) => {
        // suppose here we query and find user 001 is blocked
        return userId === '001';
      },
    },
    customValidatorArgs: {
      scoreForBlockedUser: 0,
    },
  },
  trigger: (args) => {
    // if the user is blocked, trigger the rule
    const { userId, checkUserPermission } = args.customTriggerArgs;
    return checkUserPermission(userId);
  },
  validator: (args) => {
    const { scoreForBlockedUser } = args.customValidatorArgs;
    // never recommend for blocked users
    return scoreForBlockedUser;
  },
};

describe('init Ruler', () => {
  // TODO other test of ruler
  test('rule amount', () => {
    const rules = builtInRules;
    expect(rules.length).toBe(13);
  });

  // design rule test
  test('x-axis-line-fading', () => {
    const myAdvisor = new Advisor();
    const data = [
      { price: 520, year: 2005 },
      { price: 600, year: 2006 },
      { price: 1500, year: 2007 },
    ];
    const advices = myAdvisor.advise({ data, fields: ['price', 'year'], options: { refine: true } });
    const chartSpec = advices.filter((e) => e.type === 'line_chart')[0].spec;
    if (chartSpec) {
      const layerEnc = chartSpec.layer && 'encoding' in chartSpec.layer[0] ? chartSpec.layer[0].encoding : null;
      if (layerEnc) {
        expect(layerEnc.x).toHaveProperty('axis');
        expect(layerEnc.y).toHaveProperty('scale');
      }
    }
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

  test('customized trigger and validator', () => {
    const myRuleCfg: RuleConfig = {
      custom: {
        'check-blocked-users': myRule2,
      },
    };
    const myAdvisor = new Advisor({ ruleCfg: myRuleCfg });
    const { ruleBase } = myAdvisor;
    const result = myAdvisor.advise({ data: toyData });
    // check if customTriggerArgs works
    expect(ruleBase['check-blocked-users'].option?.customTriggerArgs).toHaveProperty(['userId'], '001');
    // check if customValidatorArgs works
    expect(ruleBase['check-blocked-users'].option?.customValidatorArgs).toHaveProperty(['scoreForBlockedUser'], 0);
    // check if the rule works as expected
    expect(result.length).toBe(0);
  });
});
