---
title: Introduction to insight
order: 0
---

<embed src='@/docs/common/style.md'></embed>


A module for automatically discovering interesting patterns from multi-dimensional data.

</div>

## ✨ Features

* **Auto-Insights**: Automatically detect and highlight the insights to facilitate pattern discovery about the data.
* **Visualization & Annotation**: Clearly represent and convey insights to non-expert users.
* **Homogeneous Data Patterns**: Extract the relations between different patterns.

The pipeline of Auto-Insights:

<img src='https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*mmGnTLk5JUsAAAAAAAAAAAAADmJ7AQ/original' alt='LiteInsight pipeline' width=100%/>

## 🔨 Usage


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

## 📖 Documentation

For more usages, please check the [API Reference](../../api/insight/auto-insights).


## 🧷 Acknowledgement

Some functionalities of insight are inspired by the following works.

* [Extracting Top-K Insights from Multi-dimensional Data](https://www.microsoft.com/en-us/research/uploads/prod/2017/02/Insights_SIGMOD17.pdf)


* [MetaInsight: Automatic Discovery of Structured Knowledge for Exploratory Data Analysis](https://www.microsoft.com/en-us/research/uploads/prod/2021/03/rdm337-maA.pdf)



