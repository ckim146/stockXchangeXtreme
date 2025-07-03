
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// import Highcharts, { color } from 'highcharts'
import * as Highcharts from "highcharts/highstock";
import HighchartsReact from 'highcharts-react-official'
import { useState, useEffect, useRef } from "react";
import ibmData from './ibmData.json'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { Button, Typography } from '@mui/material'
import { TextField } from '@mui/material';
import { generateDummyCandleData } from './generateDummyData';


function App() {
  const [priceData, setPriceData] = useState([]);
  const [candleData, setCandleData] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const secondaryColor = 'rgb(240, 240, 255)';
  const mainColor = 'rgb(40, 40, 40)';
  const symbol = 'IBM';
  const chartRef = useRef();
  const dayMs = 24 * 3600 * 1000;

  //Config for the marker
  const markerData = [
    {
      x: 3,  // Match a candlestick timestamp
      y: 230,          // Choose where on the Y-axis to place the marker (e.g., high, close, etc.)
      marker: {
        enabled: true,
        radius: 15,
        symbol: 'triangle-down',
        fillColor: 'red'
      }
    }
  ];

  // Init fixed values for X Axis
  const candleInterval = 24 * 60 * 60 * 1000;
  const windowSize = candleInterval * 30;
  const initialTimestamp = candleData.length > 0 ? candleData[0][0] : Date.now();
  let currentMin = initialTimestamp;
  let currentMax = initialTimestamp + windowSize;
  console.log('currentMin:', new Date(currentMin), 'currentMax:', new Date(currentMax));


  //Config for the chart
  const options = {
    navigator: { enabled: false },
    scrollbar: { enabled: false },
    chart: {
      backgroundColor: {
        linearGradient: [0, 0, 700, 700],
        stops: [
          [0, mainColor],
          [1, secondaryColor]
        ]
      },
      animation: Highcharts.svg,
      borderWidth: 1,
      plotBackgroundColor: mainColor,
      plotShadow: true,
      plotBorderWidth: 1
    },
    xAxis: {
      type: 'datetime',
      // min: currentMin,
      // max: currentMax,
      ordinal: false,
      labels: {
        style: {
          color: secondaryColor
        }
      },
      startOnTick: false,
      endOnTick: false,
      minPadding: 0,
      maxPadding: 0.50,
    },
    yAxis: {
      opposite: false,
      min: minPrice,
      max: maxPrice,
      title: {
        text: 'Price',
        style: {
          color: secondaryColor
        },
        align: 'high',         // move label to top of axis
        rotation: 0,           // keep it horizontal
        x: 35,                // shift it left (tweak value as needed)
        y: -10
      },
      labels: {

        style: {
          color: secondaryColor
        },
      }
    },
    title: {
      text: symbol,
      style: {
        color: 'rgb(255, 255, 255)'
      }
    },
    // series: [{
    //   data: priceData
    // }],
    series: [{
      type: 'candlestick',
      name: symbol,
      data: candleData,
      animation: true,
      upColor: 'lightgreen',
      lineColor: 'white',
      upLineColor: secondaryColor,
      color: 'red',
      dataGrouping: {
        units: [
          'day'
          [1]
        ]
      }
    }],
    annotations: [{
      shapes: [{
        type: 'rect',
        point: { xAxis: 0, yAxis: 0, x: 1746144000000, y: 243 },
        width: 20,
        height: 20,
        x: 10,
        y: 25
      }],

      labels: [{
        point: { xAxis: 0, yAxis: 0, x: 3, y: 250 },
        text: 'Buy',
        backgroundColor: 'white',
        borderColor: 'green',
        style: { fontSize: '12px' },
        y: -30
      }]
    }],

    rangeSelector: {
      enabled: false
    }
  };
  //For candlestick data: [time?, open, high, low, close]

  const timeSeries = 'TIME_SERIES_DAILY';

  const [data, setData] = useState([]);
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };

  const dateBank = [["2025-05-01", "2025-06-02"]];
  let startDate = new Date();
  let endDate = new Date();
  const priceAvgs = [];


  function getDates() {
    while (startDate.getTime() <= endDate.getTime()) {
      dateRange.push(startDate.toISOString().slice(0, 10));
      startDate.setDate(startDate.getDate() + 1); // Increment by one day
    }
  }


  async function getData() {
    // const response = await fetch("https://www.alphavantage.co/query?function=" + timeSeries + "&symbol=" + symbol + "&apikey=A843ONHLADSZRCPT", requestOptions);
    // const data = await response.json();
    // console.log(await data);
    const dateObj = ibmData["Time Series (Daily)"];

    //Grab start and end dates from dateBank
    startDate = new Date(dateBank[0][0]);
    endDate = new Date(dateBank[0][1]);

    // Local tracking variables
    let localMin = Number.POSITIVE_INFINITY;
    let localMax = Number.NEGATIVE_INFINITY;

    //Extract average price for date range. Initiate tempdata
    while (startDate <= endDate) {
      let tempData = dateObj[startDate.toISOString().split('T')[0]];

      if (tempData) {
        const open = Number(tempData["1. open"]);
        const high = Number(tempData["2. high"]);
        const low = Number(tempData["3. low"]);
        const close = Number(tempData["4. close"]);

        //Find min and max value
        if (low < localMin) localMin = low;
        if (high > localMax) localMax = high;

        //Push the average to the priceAvgs array
        priceAvgs.push(open + close / 2);

        //Create inner array for candle, push to candleData
        const candle = [startDate.getTime(), open, high, low, close];
        candleData.push(candle);

      }
      startDate.setDate(startDate.getDate() + 1);

      // console.log("y console: ", candleData.map(c => new Date(c[0]).toISOString()));
      const exactTimestamp = candleData.find(c => new Date(c[0]).toISOString().startsWith('2025-05-02'))?.[0];
      console.log(exactTimestamp);

    }
    //Set Y axis min and max
    const yPadding = 5;
    //Set the state variables to the data constructed from API call
    setPriceData(priceAvgs);
    setCandleData(candleData);
    setMinPrice(localMin - yPadding);
    setMaxPrice(localMax + yPadding);
  }

  useEffect(() => { getData(); }, []);


  //Handler for starting the trade
  function handleTradeClick() {
    const chart = chartRef.current?.chart;
    if (!chart) return;
    const lastDateStr = dateBank[0][1];  // "2025-06-02"
    const lastDate = new Date(lastDateStr); // create a Date object
    const nextDate = new Date(lastDate);
    nextDate.setDate(lastDate.getDate() + 1);  // add 1 day

    const nextTimestamp = nextDate.getTime();  // milliseconds since epoch
    console.log("min max price: ", minPrice, maxPrice);

    const interval = setInterval(() => {
      const newPoint = [nextTimestamp + 1, 257.85, 263, 257, 263]; // example data
      const series = chart.series[0];
      const maxPoints = 1;
      // const dayMs = 24 * 3600 * 1000;
      // const fixedMin = new Date(dateBank[0][0]).getTime();
      // //Pad the Max X value
      // const range = nextTimestamp - fixedMin;
      // const paddedMax = nextTimestamp + range * 0.5;

      // Recalculate visible window every tick
      const windowDuration = 30 * 24 * 3600 * 1000; // 30 days in ms
      const fixedMin = nextTimestamp - windowDuration;
      const paddedMax = nextTimestamp + (windowDuration * 0.5);

      chart.xAxis[0].setExtremes(fixedMin, paddedMax, true, false);
      chart.yAxis[0].setExtremes(minPrice, maxPrice, true, false);


      series.addPoint(newPoint, true, series.data.length >= maxPoints);

      //Make the axis fixed as points are added
      chart.yAxis[0].setExtremes(minPrice, maxPrice, true, false);
      chart.xAxis[0].setExtremes(fixedMin, paddedMax, true, false);
      clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  };

  //Make a MUI object to center the entire webpage
  function CenteredBox({ children }) {
    return (
      <Box
        sx={{
          height: '100vh',          // Full viewport height
          display: 'flex',          // Flexbox layout
          justifyContent: 'center', // Center horizontally
          alignItems: 'center',     // Center vertically
        }}
      >
        {children}
      </Box>
    );
  }

  return (
    <CenteredBox>
      <Box sx={{ display: 'flex', flexDirection: 'row', width: '90vw', justifyContent: 'center', alignItems: 'flex-start', gap: 2, }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '60vw', justifyContent: 'center', alignItems: 'center' }}>
          <Paper sx={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'center', alignItems: 'center', mr: 5 }}>
            <Typography>Position Type</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', borderBottom: 1, my: 2 }}>

              <Button variant="outlined" color="success" sx={{ '&:hover': { backgroundColor: 'green', color: secondaryColor }, mr: 4, my: 2 }}>Long</Button>
              <Button variant="outlined" color="error" sx={{ '&:hover': { backgroundColor: 'red', color: secondaryColor } }}>Short</Button>
            </Box>
            <Typography>Position Size</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', borderBottom: 1, my: 2, py: 2 }}>
              $ <TextField label="Amount" type="number" variant="outlined" />
            </Box>
            <Typography>Trade!</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'center', alignItems: 'center', my: 2, py: 2 }}>
              <Button variant="outlined" color="success" sx={{ '&:hover': { backgroundColor: 'green', color: secondaryColor }, my: 3 }} onClick={handleTradeClick}>Let's Trade!</Button>
              <Button variant="outlined" color="error" sx={{ '&:hover': { backgroundColor: 'red', color: secondaryColor } }} >Close Position</Button>

            </Box>
          </Paper>
        </Box>
        <Box sx={{ width: '80%' }}>
          <HighchartsReact
            highcharts={Highcharts}
            constructorType={'stockChart'}
            options={options}
            ref={chartRef}
            containerProps={{ style: { width: '100%', height: '60vh' } }}
          />
          <Box sx={{ display: 'inline-flex', flexDirection: 'row', width: '50vw', justifyContent: 'flex-start', flexWrap: 'wrap', gap: 2, mt: 2 }}>
            <Paper sx={{ display: "flex", width: '20vw', height: '5vh', justifyContent: 'flex-start', alignItems: 'center', m: 2, p: 1 }}>Balance: </Paper>
            <Paper sx={{ display: "flex", width: '20vw', height: '5vh', justifyContent: 'flex-start', alignItems: 'center', m: 2, p: 1 }}>Gain/Loss: </Paper>
            <Paper sx={{ display: "flex", width: '40vw', height: '5vh', justifyContent: 'flex-start', alignItems: 'center', m: 2, p: 1 }}>Current Position: </Paper>
          </Box>
        </Box>
      </Box>
    </CenteredBox>
  )
}

export default App
