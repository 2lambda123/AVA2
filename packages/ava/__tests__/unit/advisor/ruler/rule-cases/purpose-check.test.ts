import { CHART_IDS, ckb } from '../../../../../src';
import { ChartRuleModule, Info } from '../../../../../src/advisor/ruler';
import { purposeCheck } from '../../../../../src/advisor/ruler/rules/purpose-check';

const applyChartTypes = CHART_IDS;

const dataProps = [
  {
    count: 3,
    distinct: 3,
    type: 'string',
    recommendation: 'string',
    missing: 0,
    rawData: ['a', 'b', 'c'],
    valueMap: { a: 1, b: 1, c: 1 },
    maxLength: 1,
    minLength: 1,
    meanLength: 1,
    containsChar: true,
    containsDigit: false,
    containsSpace: false,
    levelOfMeasurements: ['Nominal'],
    name: 'f1',
  },
  {
    count: 3,
    distinct: 1,
    type: 'integer',
    recommendation: 'integer',
    missing: 0,
    rawData: [10, 10, 10],
    valueMap: { '10': 3 },
    minimum: 10,
    maximum: 10,
    mean: 10,
    percentile5: 10,
    percentile25: 10,
    percentile50: 10,
    percentile75: 10,
    percentile95: 10,
    sum: 30,
    variance: 0,
    standardDeviation: 0,
    zeros: 0,
    levelOfMeasurements: ['Interval', 'Discrete'],
    name: 'f2',
  },
];

describe('Test: purpose-check', () => {
  test('type', () => {
    expect(purposeCheck.type).toBe('HARD');
  });

  test('trigger', () => {
    applyChartTypes.forEach((chartType) => {
      expect(
        purposeCheck.trigger({
          chartType,
          dataProps: undefined,
        })
      ).toBe(true);
    });
  });

  test('validator', () => {
    expect(
      (purposeCheck as ChartRuleModule).validator({
        chartType: 'pie_chart',
        chartWIKI: ckb(),
        dataProps: dataProps as Info['dataProps'],
        purpose: 'Proportion',
      })
    ).toBe(1);

    expect(
      (purposeCheck as ChartRuleModule).validator({
        chartType: 'line_chart',
        chartWIKI: ckb(),
        dataProps: dataProps as Info['dataProps'],
        purpose: 'no idea',
      })
    ).toBe(0);

    expect(
      (purposeCheck as ChartRuleModule).validator({
        chartType: 'line_chart',
        chartWIKI: ckb(),
        dataProps: dataProps as Info['dataProps'],
      })
    ).toBe(1);
  });
});
