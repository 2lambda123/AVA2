import { dataByChartId } from '@antv/data-samples';

import { Advisor } from '../../../../../src/advisor/index';

// In the following cases, the recommended result should be a grouped_column chart.
describe('should advise grouped_column', () => {
  test('test case from @antv/data-samples', async () => {
    const data = await dataByChartId('stacked_bar_chart');
    const myAdvisor = new Advisor();
    const advices = myAdvisor.advise({ data });
    expect(advices.map((advice) => advice.type).includes('grouped_column_chart')).toBe(true);
  });
});

// In the following cases, the recommended result should NOT be a grouped_column chart.
describe('should NOT advise bar/column', () => {
  test('categrorical field should not be x-axis of bar chart', async () => {
    const data = await dataByChartId('line_chart');
    const myAdvisor = new Advisor();
    const advices = myAdvisor.advise({ data });
    expect(advices[0].type === 'grouped_bar_chart').toBe(false);
    expect(advices[0].type === 'grouped_column_chart').toBe(false);
  });
});
