import { extractInsights, generateInsightsWithVisualizationSpec } from './insight';

import type { Datum, InsightOptions, InsightsResult, InsightVisualizationOptions } from '../types';

export function getInsights(sourceData: Datum[], options?: InsightOptions): InsightsResult {
  const extractResult = extractInsights(sourceData, options);
  if (options?.visualization) {
    // Provide all vis options
    const visOption: InsightVisualizationOptions = {
      lang: 'en-US',
      ...(options?.visualization === true ? {} : options?.visualization),
    };
    return generateInsightsWithVisualizationSpec(extractResult, { ...options, visualization: visOption });
  }
  return extractResult;
}
