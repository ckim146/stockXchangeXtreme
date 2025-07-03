
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Highcharts, { color } from 'highcharts'
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
  const secondaryColor = 'rgb(240, 240, 255)';
  const mainColor = 'rgb(40, 40, 40)';
  const symbol = 'IBM';
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
      labels: {
        style: {
          color: secondaryColor
        }
      },
      minPadding: 0,
      maxPadding: 0.1,
    },
    yAxis: {
      title: {
        text: 'Price',
        style: {
          color: secondaryColor
        }
      },
      labels: {

        style: {
          color: secondaryColor
        }
      }
    },
    title: {
      text: symbol,
      style: {
        color: 'rgb(255, 255, 255)'
      }
    },
    series: [{
      data: priceData
    },]
  }

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
      startDate.setDate(startDate.getDate() + 1);
      if (tempData) {
        const open = Number(tempData["1. open"]);
        const close = Number(tempData["4. close"]);
        priceAvgs.push(open + close / 2);
      }

    }
    setPriceData(priceAvgs);
  }

  useEffect(() => { getData(); }, []);

  //   const theme = {
  //   spacing: 8,
  // }

  return (
    <>
    <Box sx={{ display: 'flex', flexDirection: 'row', width: '90vw', justifyContent: 'center', alignItems: 'flex-start', gap: 2,}}>
      <Box sx={{ display: 'flex', flexDirection: 'row', width: '60vw', justifyContent: 'center', alignItems: 'center' }}>
      <Paper sx={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'center', alignItems: 'center', mr:5 }}>
        <Typography>Position Type</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', borderBottom: 1, my: 2 }}>
          
        <Button variant="outlined" color="success" sx ={{'&:hover': {backgroundColor: 'green',color: secondaryColor}, mr: 4, my: 2}}>Long</Button>
        <Button variant="outlined" color="error" sx ={{'&:hover': {backgroundColor: 'red',color: secondaryColor}}}>Short</Button>
        </Box>
        <Typography>Position Size</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', borderBottom: 1, my: 2, py:2 }}>
        $ <TextField label="Amount" type="number" variant="outlined"/>
        </Box>
        <Typography>Trade!</Typography>
         <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', my: 2, py:2 }}>
        <Button variant="outlined" color="error" sx ={{'&:hover': {backgroundColor: 'red',color: secondaryColor}}}>Close Position</Button>
      </Box>
      </Paper>
      </Box>
      <Box sx={{ width: '80%'}}>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          containerProps={{ style: { width: '100%', height: '60vh' } }}
        />
        <Box sx={{ display: 'inline-flex', flexDirection: 'row', width: '50vw', justifyContent: 'flex-start', flexWrap:'wrap', gap: 2, mt: 2 }}>
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
