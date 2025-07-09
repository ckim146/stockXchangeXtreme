
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// import Highcharts, { color } from 'highcharts'
import * as Highcharts from "highcharts/highstock";
import HighchartsReact from 'highcharts-react-official'
import { useState, useEffect, useRef, memo } from "react";
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
  const [posSize, setPosSize] = useState(0);
  const [gainLoss, setGainLoss] = useState(0);
  const [startingPrice, setStartingPrice] = useState(0);
  const secondaryColor = 'rgb(240, 240, 255)';
  const mainColor = 'rgb(40, 40, 40)';
  const symbol = 'IBM';
  const chartRef = useRef();
  const dayMs = 24 * 3600 * 1000;
  const gainLossRef = useRef(0);

  //Config for the marker
  // const markerData = [
  //   {
  //     x: 3,  // Match a candlestick timestamp
  //     y: 230,          // Choose where on the Y-axis to place the marker (e.g., high, close, etc.)
  //     marker: {
  //       enabled: true,
  //       radius: 15,
  //       symbol: 'triangle-down',
  //       fillColor: 'red'
  //     }
  //   }
  // ];

  // Init fixed values for X Axis
  const candleInterval = 24 * 60 * 60 * 1000;
  const windowSize = candleInterval * 30;
  const initialTimestamp = candleData.length > 0 ? candleData[0][0] : Date.now();
  let currentMin = initialTimestamp;
  let currentMax = initialTimestamp + windowSize;
  const iRef = useRef(0);


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
  //For candlestick data: [time, open, high, low, close]

  //Set the time series to be daily (to be passed to API call)
  const timeSeries = 'TIME_SERIES_DAILY';

  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };

  const dateBank = [["2025-05-01", "2025-06-02"]];
  let startDate = new Date();
  let endDate = new Date();
  const priceAvgs = [];

  //--------------------------------------- Initializing Functions --------------------------------------- //
  function getDates() {
    while (startDate.getTime() <= endDate.getTime()) {
      dateRange.push(startDate.toISOString().slice(0, 10));
      startDate.setDate(startDate.getDate() + 1); // Increment by one day
    }
  }

  function calcAverage(num1, num2) {
    return (num1 + num2) / 2
  }


  async function getData() {
    // const response = await fetch("https://www.alphavantage.co/query?function=" + timeSeries + "&symbol=" + symbol + "&apikey=A843ONHLADSZRCPT", requestOptions);
    // const data = await response.json();
    // console.log(await data);

    //Set an object that consists of all the dates as keys from the API data
    const dateObj = ibmData["Time Series (Daily)"];

    //Grab start and end dates from dateBank
    startDate = new Date(dateBank[0][0]);
    endDate = new Date(dateBank[0][1]);

    //Set starting price
    setStartingPrice(calcAverage(Number(dateObj[endDate.toISOString().split('T')[0]]["1. open"]),
      Number(dateObj[endDate.toISOString().split('T')[0]]["4. close"])));


    // Local tracking variables
    let localMin = Number.POSITIVE_INFINITY;
    let localMax = Number.NEGATIVE_INFINITY;

    //Extract average price for date range. Initiate tempdata
    while (startDate <= endDate) {
      //The date keys are strings in the format of yyyy-mm-dd, extract first date
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
      //Increment date
      startDate.setDate(startDate.getDate() + 1);

    }
    //Set initial Y axis min and max
    const yPadding = 5;
    //Set the state variables to the data constructed from API call
    setPriceData(priceAvgs);
    setCandleData(candleData);
    setMinPrice(localMin - yPadding);
    setMaxPrice(localMax + yPadding);
  }

  //Get data when page is first loaded
  useEffect(() => { getData();}, []);

  //--------------------------------------- Game Mechanics Functions --------------------------------------- //

  //Gain/Loss calculator
  function calcGainLoss(posSize, startingPrice, newPrice) {
    //Multiply the position size by the ratio of the starting price and new (current) price
    let gainLoss = (posSize * (startingPrice / newPrice)) - posSize;
    return gainLoss
  }

  // //Handler for capturing textfield input for pos size
  function posSizeChangeHandler(e) {
    setPosSize(e.target.value);
  }


  const intervalIdRef = useRef(null);
  //Handler for starting the trade
  function handleTradeClick() {
    

    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }

    const chart = chartRef.current?.chart;
    if (!chart) return;

    const lastDateStr = dateBank[0][1];  // "2025-06-02"
    const lastDate = new Date(lastDateStr); // create a Date object
    const nextDate = new Date(lastDate);
    // let i = 0;
    iRef.current = 0; 
    

    //init the dynamic TimeStamp. Set to 1 day after last date.
    nextDate.setDate(lastDate.getDate() + 1);  // add 1 day
    let nextTimestamp = nextDate.getTime();  // milliseconds since epoch

    // example data
    const newPointArray = generateDummyCandleData("2025-06-03", 10);

    intervalIdRef.current = setInterval(() => {
    //const scrollInterval = setInterval(() => {
      
      const series = chart.series[0];
      const maxPoints = 10;

      //stop animation once the iterations are complete:
      // if (iRef.current >= maxPoints) {
      //   clearInterval(scrollInterval);
      //   return
      // }
      console.log(iRef.current);
      if (iRef.current >= maxPoints) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
        setGainLoss(gainLossRef.current); // final update if needed
        return;
      }

      //recalc the next date (1 day in ms)
      nextTimestamp += 3600 * 1000 * 24;

      // Recalculate visible window every tick
      const windowDuration = 30 * 24 * 3600 * 1000; // 30 days in ms
      const minDate = nextTimestamp - windowDuration;
      const paddedMaxDate = nextTimestamp + (windowDuration * 0.5);

      //Dynamically update extremes to simulate scrolling
      chart.xAxis[0].setExtremes(minDate, paddedMaxDate, true, false);
      chart.yAxis[0].setExtremes(minPrice, maxPrice, true, false);

      //Iterate through newPointArray, add the new point
      series.addPoint(newPointArray[iRef.current], true, series.data.length >= maxPoints);
      
      console.log("point[1] (open):", newPointArray[iRef.current][1], "point[4] (low):", newPointArray[iRef.current][4]);
      //Calculate gain/loss. The dummy data generator's array: [open, close, high, low]

      const numericPosSize = parseFloat(posSize);
      const newGainLoss = (calcGainLoss(numericPosSize, startingPrice, calcAverage(newPointArray[iRef.current][1], newPointArray[iRef.current][4])));
      gainLossRef.current = newGainLoss;
      setGainLoss(newGainLoss);

      iRef.current += 1;
      
    }, 1000);

    // return () => clearInterval(scrollInterval);
  }

  //Make a MUI object to center the entire webpage
  const CenteredBox = memo( function CenteredBox({ children }) {
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
  });

//   function PositionSizeInput({ posSize, setPosSize }) {
//   const handleChange = (e) => {
//     const value = e.target.value;
//     setPosSize(value);
//   };

//   return (
//     <TextField
//       label="Amount"
//       type="number"
//       variant="outlined"
//       value={posSize}
//       onChange={handleChange}
//     />
//   );
// }

const TradeControls = memo(() => {

  return (
    <Box>
      <TextField
        value={posSize}
        onChange={(e) => setPosSize(e.target.value)}
      />
    </Box>
  );
});


  return (
    <CenteredBox>

            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', borderBottom: 1, my: 2, py: 2 }}>
              $ <TextField label="Amount" type="number" variant="outlined" value={posSize} onChange={posSizeChangeHandler} />
            </Box>
    </CenteredBox>
  )
}

export default App
