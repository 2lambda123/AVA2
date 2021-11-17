---
title: DataFrame
order: 0
---

`markdown:docs/common/style.md`

<div class="doc-md">

`DataFrame` is the specified 2D data structure in DW. You can get or slice data by it. The information includes the field's characteristics (field name, data type, statistics, etc.) and properties (continuity, discreteness, etc.), as well as field-to-field relationships (correlation, periodicity, etc.).

## new DataFrame
### Parameters
**data** Raw data _required_

Accept one-dimensional and two-dimensional data.

Type
- One-dimensional data
  - Base data structure `number | string | boolean | undefined | null`
  - One-dimensional array `any[]`
  - One-dimensional object `{ [key: string]: any }`
- Two-dimensional data
  - Two-dimensional array `any[][]`
  - Object inside array `{ [key: string]: any }[]`
  - Array inside object `{ [key: string]: any[] }`

**extra** extra parameters _optional_

Used to configure index, columns, and missing values.
  
| Property | Type | Description | Default | Required | 
| ---- | ---- | ---- | ---- | ---- |
| index | `string | number` | Index | - | - |
| columns | `string | number` | Column | - | - |
| fillValue | `any` | Filling missing value | - | - |

### Return Value
`DataFrame`

### Usage
```ts
import { DataFrame } from '@antv/data-wizard';

/* Basic usage */
const data = [
  { a: 1, b: 4, c: 7 }
  { a: 2, b: 5, c: 8 },
  { a: 3, b: 6, c: 9 },
];

new DataFrame(data);
/*
DataFrame
  {
    axes: [
      [0, 1, 2],
      ['a', 'b', 'c'],
    ],
    data: [
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
    ],
    colData: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ],
  }
*/

/* Set extra index and column */
new DataFrame(data, {
  index: ['i1', 'i2', 'i3'],
  columns: ['c', 'b'],
});
/*
DataFrame
  {
    axes: [
      ['i1', 'i2', 'i3'],
      ['c', 'b'],
    ],
    data: [
      [7, 4],
      [8, 5],
      [9, 6],
    ],
    colData: [
      [7, 8, 9],
      [4, 5, 6],
    ],
  }
*/

/* Set extra fillValues */
const data3 = [
  { a: 1, b: 4 },
  { a: 2, c: 8 },
  { b: 6, c: 9 },
];

new DataFrame(data3, {
  fillValue: 201
});
/*
DataFrame
  {
    axes: [
      [0, 1, 2],
      ['a', 'b', 'c'],
    ],
    data: [
      [1, 4, 201],
      [2, 201, 8],
      [201, 6, 9],
    ],
    colData: [
      [1, 2, 201],
      [4, 201, 6],
      [201, 8, 9],
    ],
  }
*/
```

## shape
Get the DataFrame data row and column dimensions.

### Usage
```ts
import { DataFrame } from '@antv/data-wizard';

const df = new DataFrame([
  { a: 1, b: 4, c: 7 }
  { a: 2, b: 5, c: 8 },
  { a: 3, b: 6, c: 9 },
]);

df.shape;
// [ 3, 3 ]
```

## get
Get data by row location and column location.

### Parameters
**rowLoc** Row location _required_

The location of the row described by index.

Type `(string | number) | (string | number)[] | string`

**colLoc** Column location _optional_

The location of the column described by columns.

Type `(string | number) | (string | number)[] | string`

### Return value
`DataFrame | Series | any`


### Usage
```ts
import { DataFrame } from '@antv/data-wizard';

/* index Fetch data */
const df = new DataFrame([
  { a: 1, b: 4, c: 7 },
  { a: 2, b: 5, c: 8 },
  { a: 3, b: 6, c: 9 },
]);

df.get(0);
/*
Series
  { 
    axes: [['a', 'b', 'c']], 
    data: [1, 4, 7]
  }
*/

/* index array Fetch data */
df.get([0, 2]);
/*
DataFrame
  {
    axes: [
      [0, 2],
      ['a', 'b', 'c'],
    ],
    data: [
      [1, 4, 7],
      [3, 6, 9],
    ],
    colData: [
      [1, 3],
      [4, 6],
      [7, 9],
    ],
  }
*/

/* index slice Fetch data */
df.get('0:2');
/*
DataFrame
 {
    axes: [
      [0, 1],
      ['a', 'b', 'c'],
    ],
    data: [
      [1, 4, 7],
      [2, 5, 8],
    ],
    colData: [
      [1, 2],
      [4, 5],
      [7, 8],
    ],
  }
*/

/* index + column Fetch data */
const df = new DataFrame([
  { a: 1, b: 4, c: 7 },
  { a: 2, b: 5, c: 8 },
  { a: 3, b: 6, c: 9 },
]);

df.get(1, 'c');
/*
DataFrame
  {
    axes: [[1], ['c']],
    data: [[8]],
    colData: [[8]],
  }
*/

/* index + column array Fetch data */
const df = new DataFrame([
  { a: 1, b: 4, c: 7 },
  { a: 2, b: 5, c: 8 },
  { a: 3, b: 6, c: 9 },
]);

df.get(1, ['a', 'c']);
/*
DataFrame
  {
    axes: [[1], ['a', 'c']],
    data: [[2, 8]],
    colData: [[2], [8]],
  }
*/

/* index + column slice Fetch data */
const df = new DataFrame([
  { a: 1, b: 4, c: 7 },
  { a: 2, b: 5, c: 8 },
  { a: 3, b: 6, c: 9 },
]);

df.get(1, 'a:c');
/*
DataFrame
  {
    axes: [[1], ['a', 'b']],
    data: [[2, 5]],
    colData: [[2], [5]],
  }
*/
```

## getByIntegerIndex
Get data by row location and column location using integer-index. Similar to the `get` method, but only can be used by the integer index. For example, `getByIntegerIndex(0, 0)` gets the data of the first row and column.

### Parameters
**rowLoc** Row location _required_

The integer-index row location.

Type `number | number[] | string`

**colLoc** Column location _optional_

The nteger-index column location.

Type `number | number[] | string`

### Return value
`DataFrame | Series | any`

### Usage
```ts
import { DataFrame } from '@antv/data-wizard';

/* Get data by row index */
const df = new DataFrame([
  { a: 1, b: 4, c: 7 }
  { a: 2, b: 5, c: 8 },
  { a: 3, b: 6, c: 9 },
]);

df.getByIntegerIndex(0, 1);
/*
DataFrame
  {
    axes: [[0], ['b']],
    data: [[4]],
    colData: [[4]],
  }
*/
```

## getByColumn
Get the data by columns value.

### Parameters
**col** Columns value _required_

The location of the column described by columns.

Type `string | number`

### Return value
`Series`

### Usage
```ts
import { DataFrame } from '@antv/data-wizard';

const df = new DataFrame([
  { a: 1, b: 4, c: 7 }
  { a: 2, b: 5, c: 8 },
  { a: 3, b: 6, c: 9 },
]);

df.getByColumn('a');
/*
Series
 { 
   axes: [[0, 1, 2]], 
   data: [1, 2, 3] 
  }
*/
```

## info
Get statistical information.

### Return value
`FieldsInfo`

### Usage
```ts
import { DataFrame } from '@antv/data-wizard';

const df = new DataFrame([
  { a: 1, b: 4, c: 7 },
  { a: 2, b: 5, c: 8 },
  { a: 3, b: 6, c: 9 },
]);

df.info();
/*
  [
    {
      count: 3,
      distinct: 3,
      type: 'integer',
      recommendation: 'integer',
      missing: 0,
      rawData: [1, 2, 3],
      valueMap: { '1': 1, '2': 1, '3': 1 },
      minimum: 1,
      maximum: 3,
      mean: 2,
      percentile5: 1,
      percentile25: 1,
      percentile50: 2,
      percentile75: 3,
      percentile95: 3,
      sum: 6,
      variance: 0.6666666666666666,
      standardDeviation: 0.816496580927726,
      zeros: 0,
      levelOfMeasurements: ['Interval', 'Discrete'],
      name: 'a',
    },
    {
      count: 3,
      distinct: 3,
      type: 'integer',
      recommendation: 'integer',
      missing: 0,
      rawData: [4, 5, 6],
      valueMap: { '4': 1, '5': 1, '6': 1 },
      minimum: 4,
      maximum: 6,
      mean: 5,
      percentile5: 4,
      percentile25: 4,
      percentile50: 5,
      percentile75: 6,
      percentile95: 6,
      sum: 15,
      variance: 0.6666666666666666,
      standardDeviation: 0.816496580927726,
      zeros: 0,
      levelOfMeasurements: ['Interval', 'Discrete'],
      name: 'b',
    },
    {
      count: 3,
      distinct: 3,
      type: 'integer',
      recommendation: 'integer',
      missing: 0,
      rawData: [7, 8, 9],
      valueMap: { '7': 1, '8': 1, '9': 1 },
      minimum: 7,
      maximum: 9,
      mean: 8,
      percentile5: 7,
      percentile25: 7,
      percentile50: 8,
      percentile75: 9,
      percentile95: 9,
      sum: 24,
      variance: 0.6666666666666666,
      standardDeviation: 0.816496580927726,
      zeros: 0,
      levelOfMeasurements: ['Interval', 'Discrete'],
      name: 'c',
    },
  ]
*/
```
</div>