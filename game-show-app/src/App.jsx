
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useState, useEffect } from "react";

function App() {
  const [count, setCount] = useState(0)
  const options = {
    title: {
      text: 'My chart'
    },
    series: [{
      data: [1, 2, 3]
    }]
  }

  const timeSeries = 'TIME_SERIES_DAILY';
  const symbol = 'IBM';
  const [data, setData] = useState([]);
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };

  const startDate = new Date('2025-01-15');
  const endDate = new Date('2025-01-20');
  const dateRange = [];

  function getDates() {
    while (startDate.getTime() <= endDate.getTime()) {
      dateRange.push(startDate.toISOString().slice(0, 10));
      startDate.setDate(startDate.getDate() + 1); // Increment by one day
    }
  }



  //  async function getData() {
  //     const response = await fetch("https://www.alphavantage.co/query?function=" + timeSeries + "&symbol=" + symbol + "&apikey=A843ONHLADSZRCPT", requestOptions)
  //     const data = await response.json()
  //     console.log(await data)
  //   }

  //     useEffect(() => {getData();}, []);
    useEffect(() => {getDates();}, []);

  return (
    <>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
