
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
      }
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

  //Styling for each item in the grids
  const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: mainColor,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: secondaryColor,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

  return (
    <>
    {/* <Stack direction="row" spacing={2}> */}
      <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
      This Box renders as an HTML section element.
    </Box>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
      <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid size={8}>
          <Item>Balance: </Item>
        </Grid>
        <Grid size={4}>
          <Item>Gain/Loss: </Item>
        </Grid>
        <Grid size={8}>
          <Item>Current Position: </Item>
        </Grid>
      </Grid>
    </Box>
    {/* </Stack> */}

    </>
  )
}

export default App
