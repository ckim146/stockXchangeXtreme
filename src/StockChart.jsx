import { Highcharts } from 'react-highcharts'
import React from 'react';
import Highstock from 'react-highcharts/ReactHighstock.src';
import Highlight from 'react-highlight';
import Exporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';

Exporting(Highcharts);

const data = [
  [1220832000000, 22.56], [1220918400000, 21.67], [1221004800000, 21.66],
  [1221091200000, 21.81], [1221177600000, 21.28], [1221436800000, 20.05],
  // ... (truncated for brevity)
  [1228953600000, 13.57], [1229040000000, 14.04], [1229299200000, 13.54]
];

const config = {
  rangeSelector: {
    selected: 1
  },
  title: {
    text: 'AAPL Stock Price'
  },
  series: [{
    name: 'AAPL',
    data: data,
    tooltip: {
      valueDecimals: 2
    }
  }]
};

const StockChart = () => {
  return (
    <div>
      <div id="chart">
        <Highstock config={config} />
      </div>

      <div id="code-js">
        <Highlight className="jsx">
{`import React from 'react';
import Highstock from 'react-highcharts/ReactHighstock.src';

const data = [...]; // stock data
const config = { ... };

const HighstockChart = () => (
  <Highstock config={config} />
);

export default HighstockChart;`}
        </Highlight>
      </div>

      <div id="code-html">
        <Highlight className="html">
{`<div id="chart"></div>
<div id="code-js"></div>
<div id="code-html"></div>`}
        </Highlight>
      </div>
    </div>
  );
};

export default StockChart;