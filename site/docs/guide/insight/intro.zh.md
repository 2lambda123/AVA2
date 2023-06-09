---
title: insight 简介
order: 0
---

<embed src='@/docs/common/style.md'></embed>


从多维数据中自动地发现数据洞察。

</div>


## ✨ 功能特性

* **自动洞察**: 自动检测并突出显示数据中的洞察，以促进数据分析过程中的模式发现。
* **可视化 & 注释**: 直观地向非专业分析人员展示和传达数据中地洞察发现。
* **共性/例外模式**: 挖掘不同数据模式之间存在的共性和差异。

自动洞察的流程如下：

<img src='https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*es5sSYS6XIUAAAAAAAAAAAAADmJ7AQ/original' alt='LiteInsight pipeline' width=100%/>

## 🔨 使用


```ts
import { getInsights } from '@antv/ava';

getInsights(data, {
  limit: 30,
  measures: [
    { fieldName: 'life_expect', method: 'MEAN' },
    { fieldName: 'pop', method: 'SUM' },
    { fieldName: 'fertility', method: 'MEAN' },
  ]
});
```


## 📖 文档

更多用法请移步至 [API](../../api/insight/auto-insights)。

## 🧷 致谢

insight 其中的一些功能设计受到以下论文的启发：

* [Extracting Top-K Insights from Multi-dimensional Data](https://www.microsoft.com/en-us/research/uploads/prod/2017/02/Insights_SIGMOD17.pdf)


* [MetaInsight: Automatic Discovery of Structured Knowledge for Exploratory Data Analysis](https://www.microsoft.com/en-us/research/uploads/prod/2021/03/rdm337-maA.pdf)


