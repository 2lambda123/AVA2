import { IntervalMark, RectMark, LineMark, PointMark, TextMark, CellMark, AreaMark } from '@antv/g2';

import type { ColorSchemeType } from '@antv/color-schema';
import type { SimulationType } from '@antv/smart-color';
/** AVA 包内跨模块引用 */
import type { Purpose, CkbConfig } from '../ckb';
import type { Specification, Data } from '../common/types';
/** Advisor 模块内引用 */
import type { RuleConfig, BasicDataPropertyForAdvice, Preferences, RuleType } from './ruler/types';

/**
 * Advisor config type
 */
export type AdvisorConfig = {
  ckbCfg?: CkbConfig;
  ruleCfg?: RuleConfig;
};

/**
 * Single chart-recommendation from advisor.
 *
 * @public
 */
export type Advice = {
  /**
   * Chart Type: should be standard CKB ChartID or any string id for customized chart.
   */
  type: string;
  /**
   * for the recommended chart, the specification information needs to be declared,
   * which may be antv-spec or custom spec (for indicator cards and cross tabs)
   */
  spec: Specification | null;
  /**
   * A score summarized by rule scoring, which measures how well an individual chart
   * is recommended in a recommendation scenario.
   * The higher the score, the more recommended it is
   */
  score: number;
  /**
   * lint array: problems that remain after the recommendation, with possible solutions accordingly.
   */
  lint?: Lint[];
};

/**
 * Describe a chart recommendation problem.
 */
export type Lint = {
  /** rule type: 'HARD' | 'SOFT' | 'DESIGN'  */
  type: RuleType;
  /** rule id: standard ruleId or any string for custom rule */
  id: string;
  /** rule score */
  score: number;
  /** fix solution */
  fix?: any;
  /** docs: explanation */
  docs?: any;
};

export type AdviseParams = ChartAdviseParams;

export type ChartAdviseParams = {
  /** input data to advise */
  data: Data;
  /** customized data props to advise */
  dataProps?: Partial<BasicDataPropertyForAdvice>[];
  /** data fields to focus, apply in `data` and `dataProps` */
  fields?: string[];
  /** SmartColor mode on/off */
  smartColor?: boolean;
  /** advising options such as purpose, layout preferences */
  options?: AdvisorOptions;
  /** smart color options */
  colorOptions?: SmartColorOptions;
};

/**
 * @public
 */
export type AdvisorOptions = {
  /**
   * analysis purpose, correspond to purpose of CKB, including
   * Comparison
   * Trend
   * Distribution
   * Rank
   * Proportion
   * Composition
   */
  purpose?: Purpose;
  /**
   * preference settings for landscape or portrait
   */
  preferences?: Preferences;
  /**
   * whether to apply design rules
   */
  refine?: boolean;
  /**
   * specify fields in the dataset
   */
  fields?: string[];
  /**
   * whether to show scoring process in console
   * @deprecated since 3.0.0, use `exportLog` instead
   */
  showLog?: boolean;
  /**
   * custom theme
   */
  theme?: Theme;
  /**
   * only consider chart types with spec
   */
  requireSpec?: boolean;
};

export type Theme = {
  /** hex string */
  primaryColor?: string;
};

/**
 * return type of color options for smart color
 * @public
 */
export type SmartColorOptions = {
  /**
   *  hex string
   */
  themeColor?: string;
  /**
   * mode employed for color generation
   */
  colorSchemeType?: ColorSchemeType;
  /**
   * mode employed for color simulation
   */
  simulationType?: SimulationType;
};

export type AdviseResult = {
  advices: Advice[];
  log: ScoringResultForChartType[];
};

export type LintResult = {
  lints: Lint[];
  log: ScoringResultForRule[];
};

/**
 * Log for scoring a single rule.
 */
export interface ScoringResultForRule {
  phase: 'ADVISE' | 'LINT';
  /**
   * standard ChartRuleId or any string id for custom rule
   */
  ruleId: string;
  /**
   * scoring result for this rule, score = base * weight
   */
  score: number;
  /**
   * scoring from validator
   */
  base: number;
  /**
   * weight of this rule
   */
  weight: number;
  /**
   * type of this rule
   */
  ruleType: RuleType;
}

/**
 * Summary log of checking all rules for a single chart type.
 */
export interface ScoringResultForChartType {
  /**
   * scoring for this chart type: standard ChartId or any string for custom chart
   */
  chartType: string;
  /**
   * final score
   */
  score: number;
  /**
   * whole records of scoring
   */
  log?: ScoringResultForRule[];
}

export * from './ruler/types';

export interface LinterOptions {
  purpose?: Purpose;
  preferences?: Preferences;
}

export interface LintParams {
  spec: Specification;
  dataProps?: BasicDataPropertyForAdvice[];
  options?: LinterOptions;
}

/** g2-spec 相关types */

export type Mark = IntervalMark | RectMark | LineMark | PointMark | TextMark | CellMark | AreaMark;

export type Primitive = number | string | boolean | Date;

export type TabularData = Record<string, Primitive>[];

export type Callback = (datum: Record<string, Primitive>, index: number, data: TabularData) => Primitive;

export type DataType = 'quantitative' | 'categorical' | 'temporal';

/** Encode 的值 */
export type Encode = Primitive | Callback;

/** Encode 的对象 */
export type MarkEncode = Record<string, Encode>;

/** 带有字段类型的 Encode 对象 */
export type MarkEncodeWithType = Record<string, { field: Encode; type: DataType }>;

/** 原 G2 spec 去掉复杂 Encode 类型并添加简易版 Encode 类型 */
export type G2ChartSpec = Omit<Mark, 'encode'> & { encode: MarkEncode };

/** 原 G2 spec 去掉复杂 Encode 类型并添加简易版（带字段类型的） Encode 类型 */
export type ChartSpecWithEncodeType = Omit<Mark, 'encode'> & { encode: MarkEncodeWithType };

export type { Specification };
