import { sumBy } from 'lodash';

import { sign, unique } from '../../insight/utils/common';
import { TrendType } from '../../insight/types';
import { normalDistributionQuantile, cdf } from '..';

/**
 * http://vsp.pnnl.gov/help/Vsample/Design_Trend_Mann_Kendall.htm
   the Mann-Kendall (MK) test is to statistically assess if there
   is a monotonic upward or downward trend of the variable of
   interest over time.
   使用 Mann-Kendall 单调趋势检验判断趋势是否有方向性（上升/下降）
 * @param data 
 * @param alpha 
 */
export function mkTest(data: number[], alpha: number = 0.05) {
  const length = data?.length;
  let S = 0;
  for (let k = 0; k < length - 1; k += 1) {
    for (let j = k + 1; j < length; j += 1) {
      S += sign(data[j] - data[k]);
    }
  }
  const [uniqArr, uniqCount] = unique(data);

  const uniqLength = uniqArr.length;

  const varS =
    (length * (length - 1) * (2 * length + 5) -
      (uniqLength === length ? 0 : sumBy(uniqCount, (c) => c * (c - 1) * (2 * c + 5)))) /
    18;

  let zScore = 0;

  if (S > 0) {
    zScore = (S - 1) / Math.sqrt(varS);
  } else if (S < 0) {
    zScore = (S + 1) / Math.sqrt(varS);
  }

  // calculate the p_value
  const pValue = 2 * (1 - cdf(Math.abs(zScore), 0, 1));
  const h = Math.abs(zScore) > normalDistributionQuantile(1 - alpha / 2, 0, 1);

  let trend: TrendType = 'no trend';
  if (zScore < 0 && h) {
    trend = 'decreasing';
  } else if (zScore > 0 && h) {
    trend = 'increasing';
  }

  return {
    trend,
    pValue,
    zScore,
  };
}
