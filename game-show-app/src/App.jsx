
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// import Highcharts, { color } from 'highcharts'
import * as Highcharts from "highcharts/highstock";
import HighchartsReact from 'highcharts-react-official'
import { useState, useEffect } from "react";
import ibmData from './ibmData.json'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { Button, Typography } from '@mui/material'
import { TextField } from '@mui/material';


function App() {
  const [priceData, setPriceData] = useState([])
  const [candleData, setCandleData] = useState([])
  const secondaryColor = 'rgb(240, 240, 255)';
  const mainColor = 'rgb(40, 40, 40)';
  const symbol = 'IBM';
  const chartComponentRef = useRef();

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
  //Config for the chart
  const options = {
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

    //Extract average price for date range. Initiate tempdata
    while (startDate <= endDate) {
      let tempData = dateObj[startDate.toISOString().split('T')[0]];

      if (tempData) {
        const open = Number(tempData["1. open"]);
        const high = Number(tempData["2. high"]);
        const low = Number(tempData["3. low"]);
        const close = Number(tempData["4. close"]);

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
    //Set the state variables to the data constructed from API call
    setPriceData(priceAvgs);
    setCandleData(candleData);
  }

  useEffect(() => { getData(); }, []);

  //   const theme = {
  //   spacing: 8,
  // }

  return (
    <>
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
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', my: 2, py: 2 }}>
              <Button variant="outlined" color="error" sx={{ '&:hover': { backgroundColor: 'red', color: secondaryColor } }}>Close Position</Button>
            </Box>
          </Paper>
        </Box>
        <Box sx={{ width: '80%' }}>
          <HighchartsReact
            highcharts={Highcharts}
            constructorType={'stockChart'}
            options={options}
            ref={chartComponentRef}
            containerProps={{ style: { width: '100%', height: '60vh' } }}
          />
          <Box sx={{ display: 'inline-flex', flexDirection: 'row', width: '50vw', justifyContent: 'flex-start', flexWrap: 'wrap', gap: 2, mt: 2 }}>
            <Paper sx={{ display: "flex", width: '20vw', height: '5vh', justifyContent: 'flex-start', alignItems: 'center', m: 2, p: 1 }}>Balance: </Paper>
            <Paper sx={{ display: "flex", width: '20vw', height: '5vh', justifyContent: 'flex-start', alignItems: 'center', m: 2, p: 1 }}>Gain/Loss: </Paper>
            <Paper sx={{ display: "flex", width: '40vw', height: '5vh', justifyContent: 'flex-start', alignItems: 'center', m: 2, p: 1 }}>Current Position: </Paper>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default App
