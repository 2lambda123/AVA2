import { hasSubset } from '../../utils';
import { compare } from '../utils';

import { MAX_SOFT_RULE_COEFFICIENT } from './constants';

import type { RuleModule, BasicDataPropertyForAdvice } from '../types';

const applyChartTypes = [
  'bar_chart',
  'column_chart',
  'grouped_bar_chart',
  'grouped_column_chart',
  'stacked_bar_chart',
  'stacked_column_chart',
];

function getNominalFields(dataProps: BasicDataPropertyForAdvice[]) {
  return dataProps.filter((field) => hasSubset(field.levelOfMeasurements, ['Nominal']));
}

export const nominalEnumCombinatorial: RuleModule = {
  id: 'nominal-enum-combinatorial',
  type: 'SOFT',
  docs: {
    lintText:
      'Single (Basic) and Multi (Stacked, Grouped,...) charts should be optimized recommended by nominal enums combinatorial numbers.',
  },
  trigger: ({ chartType, dataProps }) => {
    return (
      applyChartTypes.includes(chartType) && getNominalFields(dataProps as BasicDataPropertyForAdvice[]).length >= 2
    );
  },
  validator: (args): number => {
    let result = 1;
    const { dataProps, chartType } = args;

    if (dataProps) {
      const nominalFields = getNominalFields(dataProps as BasicDataPropertyForAdvice[]);

      if (nominalFields.length >= 2) {
        const sortedNominals = nominalFields.sort(compare);

        const f1 = sortedNominals[0];
        const f2 = sortedNominals[1];

        if (f1.distinct === f1.count) {
          if (['bar_chart', 'column_chart'].includes(chartType)) {
            result = MAX_SOFT_RULE_COEFFICIENT * 0.5;
          }
        }

        if (f1.count && f1.distinct && f2.distinct && f1.count > f1.distinct) {
          const typeOptions: string[] = [
            'grouped_bar_chart',
            'grouped_column_chart',
            'stacked_bar_chart',
            'stacked_column_chart',
          ];
          if (typeOptions.includes(chartType)) {
            result = MAX_SOFT_RULE_COEFFICIENT * 0.5;
          }
        }
      }
    }

    return result;
  },
};
