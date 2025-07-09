import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
// import Highcharts, { color } from 'highcharts'
import * as Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
// import AnnotationsModule from 'highcharts/modules/annotations';
import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { Button, radioClasses, Typography } from "@mui/material";
import { TextField } from "@mui/material";
import { generateDummyCandleData } from "./generateDummyData";
import { calculateStats } from "./calculateStats";
import { StatsPanel } from "./statsPanel";
import { FinishDialog } from "./FinishDialog";
import dateBank from "./dateBank.json";
import StockDataSim from "./StockData.json";
import LeaderboardHover from "./LeaderBoard";
import CheatSheetsHover from "./CheatSheets";

function App() {
  const [priceData, setPriceData] = useState([]);
  // const [priceAvgs, setPriceAvgs] = useState([]);
  // const [candleData, setCandleData] = useState([]);
  // const [futureCandleData, setFutureCandleData] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [posSize, setPosSize] = useState();
  const [posType, setPosType] = useState("");
  const [gainLoss, setGainLoss] = useState(0);
  const [startingPrice, setStartingPrice] = useState(0);
  const [balance, setBalance] = useState(1000);
  const [tradeRunning, setTradeRunning] = useState(false);
  const [tradePaused, setTradePaused] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [passed, setPassed] = useState(true);
  const [randomNumber, setRandomNumber] = useState(0);
  const [symbol, setSymbol] = useState("");
  const [LBEntry, setLBEntry] = useState(null);
  const secondaryColor = "rgb(240, 240, 255)";
  const mainColor = "rgb(40, 40, 40)";
  const symbols = Object.keys(dateBank);
  const chartRef = useRef();
  const roundRef = useRef(1);
  const dayMs = 24 * 3600 * 1000;
  const finishedDates = useRef(
    Object.fromEntries(Object.keys(dateBank).map((symbol) => [symbol, []]))
  );
  const priceAvgsRef = useRef([]);
  const futurePriceAvgsRef = useRef([]);
  const apikey = import.meta.env.VITE_API_KEY3;
  const symbolRef = useRef("");
  const randomNumberRef = useRef(0);
  const candleDataRef = useRef([]);
  const futureCandleDataRef = useRef([]);
  const balanceRef = useRef(1000);
  const StockData = useRef({});

  // Init fixed values for X Axis
  const candleInterval = 24 * 60 * 60 * 1000;
  const windowSize = candleInterval * 30;
  const initialTimestamp =
    candleDataRef.current.length > 0 ? candleDataRef.current[0][0] : Date.now();
  let currentMin = initialTimestamp;
  let currentMax = initialTimestamp + windowSize;

  //Config for the chart
  const options = {
    navigator: { enabled: false },
    scrollbar: { enabled: false },
    chart: {
      backgroundColor: {
        // linearGradient: [0, 0, 1000, 1000],
        stops: [
          [0, mainColor],
          [1, secondaryColor],
        ],
      },
      borderColor: mainColor,
      animation: Highcharts.svg,
      borderWidth: 0,
      plotBackgroundColor: mainColor,
      plotShadow: true,
      plotBorderWidth: 1,
    },
    xAxis: {
      type: "datetime",
      // min: currentMin,
      // max: currentMax,
      ordinal: false,
      labels: {
        style: {
          color: secondaryColor,
        },
      },
      startOnTick: false,
      endOnTick: false,
      minPadding: 0,
      maxPadding: 0.5,
    },
    yAxis: {
      opposite: false,
      min: minPrice,
      max: maxPrice,
      title: {
        text: "Price",
        style: {
          color: secondaryColor,
        },
        align: "high", // move label to top of axis
        rotation: 0, // keep it horizontal
        x: 35, // shift it left (tweak value as needed)
        y: -10,
      },
      labels: {
        style: {
          color: secondaryColor,
        },
      },
    },
    title: {
      text: symbolRef.current,
      style: {
        color: "rgb(255, 255, 255)",
      },
    },
    // series: [{
    //   data: priceData
    // }],
    series: [
      {
        type: "candlestick",
        name: symbolRef.current,
        data: candleDataRef.current,
        animation: true,
        upColor: "lightgreen",
        lineColor: "white",
        upLineColor: secondaryColor,
        color: "red",
        dataGrouping: {
          units: ["day"[1]],
        },
      },
      {
        type: "line",
        name: "Avg Price",
        data: priceData,
        color: "lightblue", // Orange or any highlight color
        lineWidth: 2,
        marker: {
          enabled: false,
        },
      },
    ],

    rangeSelector: {
      enabled: false,
    },
  };

  // const dateBank = {"IBM": [["2025-05-27", "2025-06-25"], ["2025-03-14", "2025-04-14"], ["2025-4-09", "2025-05-09"], ["2025-05-02", "2025-06-02"]]};
  let startDate = new Date();
  let endDate = new Date();
  let continueDate = new Date();

  //--------------------------------------- Initializing Functions --------------------------------------- //
  // function getDates() {
  //   //Shorten logic to obtain usable dates. Continue date is the date that the data will continue to after end date (+ 15 days)
  //   let localStartDate = startDate.getTime();
  //   const localEndDate = endDate.getTime();
  //   const localContinueDate = localEndDate + 15 * dayMs
  //   while (localStartDate <= localContinueDate) {
  //     if (localStartDate <= localEndDate) {
  //     dateRange.push(startDate.toISOString().slice(0, 10));
  //     startDate.setDate(startDate.getDate() + 1);
  //     }

  //     else if (localStartDate > localEndDate && localStartDate <= localContinueDate) {

  //     }
  //   }
  // }

  function calcAverage(num1, num2) {
    return (num1 + num2) / 2;
  }

  async function getData() {
    //Init symbol random number
    let symbolRandomNumber = Math.floor(Math.random() * symbols.length);
    //Set a local variable to a randomized symbol
    let localSymbol = symbols[symbolRandomNumber];
    //Assign symbol to the symbol Ref and state variable for calculation/rendering respectively
    symbolRef.current = localSymbol;
    setSymbol(localSymbol);
    let tempData = {};
    //Set the time series to be daily (to be passed to API call)
    const timeSeries = "TIME_SERIES_DAILY";
    const requestOptions = { method: "GET", redirect: "follow" };
    console.log("StockData", StockData);
    //Check if generated symbol is already loaded
    if (!(localSymbol in StockData.current)) {
      tempData = StockDataSim[localSymbol]; //replace with api call
      // tempData = await fetch("https://www.alphavantage.co/query?function=" + timeSeries + "&symbol=" + localSymbol + "&apikey=" + apikey);
      // let tempDataJSON = await tempData.json();
      StockData.current[localSymbol] = tempData;
    }

    const symbolExhausted =
      Object.keys(dateBank[localSymbol]).length ==
      finishedDates.current[localSymbol].length;
    //Gen new random symbols if the finished dates for the symbol matches the length of its dateBank
    while (symbolExhausted) {
      //Init symbol random number again
      symbolRandomNumber = Math.floor(Math.random() * symbols.length);
      //Set a local variable to a randomized symbol again
      localSymbol = symbols[symbolRandomNumber];
    }
    // console.log("https://www.alphavantage.co/query?function=" + timeSeries + "&symbol=" + localSymbol + "&apikey=" + apikey, requestOptions);
    // const response = await fetch("https://www.alphavantage.co/query?function=" + timeSeries + "&symbol=" + localSymbol + "&apikey=OMG7T13N90NHCAJX");
    // const data = await response.json();
    // console.log("data", await data);
    const chart = chartRef.current?.chart;

    //Set an object that consists of all the dates as keys from the API data
    const dateObj = StockData.current[localSymbol]["Time Series (Daily)"];

    //generate a random number that is not in the finishedDates array
    let localRandomNumber = Math.floor(
      Math.random() * dateBank[localSymbol].length
    ); // Generates a random integer between 0 and last index of dateBank
    while (localRandomNumber in finishedDates.current[localSymbol]) {
      localRandomNumber = Math.floor(
        Math.random() * dateBank[localSymbol].length
      );
    }

    randomNumberRef.current = localRandomNumber;
    setRandomNumber(localRandomNumber);

    //Go ahead and push the randomNumber into finishedDates after determining it's not in finishedDates
    finishedDates.current[localSymbol].push(localRandomNumber);

    //Grab start and end dates from dateBank. Continue date is the date that the data will continue to after end date (+ 15 days)
    startDate = new Date(dateBank[localSymbol][localRandomNumber][0]);
    endDate = new Date(dateBank[localSymbol][localRandomNumber][1]);
    const continueDate = new Date(endDate);
    continueDate.setDate(continueDate.getDate() + 15);

    //Set starting price
    setStartingPrice(
      calcAverage(
        Number(dateObj[endDate.toISOString().split("T")[0]]["1. open"]),
        Number(dateObj[endDate.toISOString().split("T")[0]]["4. close"])
      )
    );

    // Local tracking variables
    let localMin = Number.POSITIVE_INFINITY;
    let localMax = Number.NEGATIVE_INFINITY;

    //Extract average price for date range. Initiate tempdata
    while (startDate <= continueDate) {
      //The date keys are strings in the format of yyyy-mm-dd, extract first date
      let tempData = dateObj[startDate.toISOString().split("T")[0]];

      if (tempData) {
        const open = Number(tempData["1. open"]);
        const high = Number(tempData["2. high"]);
        const low = Number(tempData["3. low"]);
        const close = Number(tempData["4. close"]);

        //Find min and max value
        if (low < localMin) localMin = low;
        if (high > localMax) localMax = high;

        //Create inner array for candle
        const candle = [startDate.getTime(), open, high, low, close];

        //Push to candleData (The candles pre-loaded onto graph), concurrently push avg data for preloaded data
        if (startDate <= endDate) {
          candleDataRef.current.push(candle);
          priceAvgsRef.current.push([startDate.getTime(), (open + close) / 2]);
        }
        //When the date reaches between endDate and continueDate, push the future data and avgs
        else if (startDate > endDate && startDate <= continueDate) {
          futureCandleDataRef.current.push(candle);
          futurePriceAvgsRef.current.push([
            startDate.getTime(),
            (open + close) / 2,
          ]);
        }
      }
      //Increment date
      startDate.setDate(startDate.getDate() + 1);
    }
    //Find last pre-loaded candle for the start marker
    const lastCandle = candleDataRef.current[candleDataRef.current.length - 1];
    const lastTime = lastCandle[0];
    const lastClose = lastCandle[4];

    //Add marker to chart
    // chart.addAnnotation(markerOptions(lastTime, lastClose));
    // chart.redraw();

    //Set initial Y axis min and max
    const yPadding = 5;
    //Set the state variables to the data constructed from API call
    setPriceData(priceAvgsRef.current);
    // setCandleData(candleDataRef.current);
    setMinPrice(localMin - yPadding);
    setMaxPrice(localMax + yPadding);
  }

  //Get data when page is first loaded
  useEffect(() => {
    getData();
    //Set all finishedDates for each symbol to 0
    Object.keys(finishedDates.current).forEach((key) => {
      finishedDates.current[key] = [];
    });
  }, []);

  //--------------------------------------- Game Mechanics Functions --------------------------------------- //

  //Handler for capturing textfield input for pos size
  function posSizeChangeHandler(event) {
    const value = Number(event.target.value);
    if (value >= 0 && value <= balance) {
      setPosSize(value);
    }
  }

  //Use ref to store future data, interval ID, and i to persist across re-renders
  const intervalIdRef = useRef(null);
  const iRef = useRef(0);

  //Handler for starting the trade
  function handleTradeClick() {
    //Initiate the iteration ref to 0, get the chartRef, declare trade is running
    iRef.current = 0;
    const chart = chartRef.current?.chart;
    setTradeRunning(true);
    console.log("Starting interval, iRef.current =", iRef.current);
    //Error checker in case the chart failed to load
    if (!chart) return;

    // Clear any existing interval before starting a new one
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }

    const firstDateStr =
      dateBank[symbolRef.current][randomNumberRef.current][0];
    const firstDate = new Date(firstDateStr);
    const lastDateStr = dateBank[symbolRef.current][randomNumberRef.current][1];
    const lastDate = new Date(lastDateStr);
    const nextDate = new Date(lastDate);

    //init the dynamic TimeStamp. Set to 1 day after last date.
    nextDate.setDate(lastDate.getDate() + 1); // add 1 day
    let nextTimestamp = nextDate.getTime(); // milliseconds since epoch
    // example data
    // futurePointsArrayRef.current = generateDummyCandleData("2025-06-03", 10);
    const maxPoints = 15;

    // const scrollInterval = setInterval(() => {
    intervalIdRef.current = setInterval(() => {
      const series = chart.series[0];
      const avgSeries = chart.series[1];
      console.log("past max points?", iRef.current, maxPoints);
      //stop animation once the iterations are complete:
      if (iRef.current >= maxPoints) {
        //   clearInterval(scrollInterval);
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
        return;
      }

      //recalc the next date (1 day in ms)
      nextTimestamp += dayMs;

      // Recalculate visible window every tick
      //const windowDuration = 30 * 24 * 3600 * 1000; // 30 days in ms
      const windowDuration = lastDate.getTime() - firstDate.getTime();
      const minDate = nextTimestamp - windowDuration;
      const paddedMaxDate = nextTimestamp + windowDuration * 0.5;

      //Dynamically update extremes to simulate scrolling
      chart.xAxis[0].setExtremes(minDate, paddedMaxDate, true, false);
      chart.yAxis[0].setExtremes(minPrice, maxPrice, true, false);

      //get new points
      const point = futureCandleDataRef.current[iRef.current];
      const avgPoint = futurePriceAvgsRef.current[iRef.current];

      // Early bail-out if data is missing
      if (!point || !avgPoint) {
        console.warn(
          "Missing data at index",
          iRef.current,
          "— stopping scroll."
        );
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
        return;
      }

      //Iterate through futureCandleData Array, add the new point
      series.addPoint(point, true, series.data.length >= maxPoints);
      avgSeries.addPoint(avgPoint, true, avgSeries.data.length >= maxPoints);

      //Calculate gain/loss. The candle array: [open, high, low, close]
      setGainLoss(
        calculateStats(posSize, startingPrice, point[1], point[4], posType)
      );
      iRef.current++;
    }, 1000);

    // return () => clearInterval(scrollInterval);
  }

  //Handler for closing the trade
  function handleCloseClick() {
    //Indicate the trade has stopped, apply gain/loss from balance, reset position size, clear timer running the trade
    setTradeRunning(false);
    setBalance(balance + gainLoss);
    balanceRef.current = balance + gainLoss;
    setPosSize(0);
    clearInterval(intervalIdRef.current);
    setTradePaused(true);
    setPosType();
    intervalIdRef.current = null;

    //If the balance is negative, or 0 set passed to false
    if (balanceRef.current <= 0) {
      setPassed(false);
      setDialogOpen(true);
    } else if (roundRef.current == 5) {
      //Passed is set to true to default, just open dialog is they survived
      setDialogOpen(true);
    }
  }

  //Handler for closing the trade
  async function handleNextClick() {
    const chart = chartRef.current?.chart;
    if (!chart) return;

    //Remove all points
    const series = chart.series[0];
    const avgSeries = chart.series[1];
    while (series.data.length > 0) {
      series.removePoint(0, false); // false = don't redraw yet
    }
    while (avgSeries.data.length > 0) {
      avgSeries.removePoint(0, false); // false = don't redraw yet
    }

    //Reset axes
    chart.xAxis[0].setExtremes(null, null, false, false); // auto
    chart.yAxis[0].setExtremes(null, null, false, false);

    // Reset gain/loss
    setGainLoss(0);

    //Reset iteration ref and future candle data
    iRef.current = 0;
    // setFutureCandleData([]);

    //Reset data
    priceAvgsRef.current = [];
    futurePriceAvgsRef.current = [];
    candleDataRef.current = [];
    futureCandleDataRef.current = [];
    // pointArrayRef.current = [];

    //Generate new dummy data for next trade
    // const newDate = "2025-05-03"; // or generate a new starting date
    // pointArrayRef.current = generateDummyCandleData(newDate, 20);

    //Add new points to the chart (false in addPoint defers redraw)
    // pointArrayRef.current.forEach((point, idx) => {
    //   series.addPoint(point, false);
    // });
    await getData();

    //Redraw chart
    chart.redraw();

    //Iterate round #
    roundRef.current++;

    //Set trade to unpaused
    setTradePaused(false);
  }

  //Reset game method
  async function resetGame() {
    // Clear interval if running
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }

    // Reset refs
    iRef.current = 0;
    symbolRef.current = null;
    futureCandleDataRef.current = [];
    futurePriceAvgsRef.current = [];
    priceAvgsRef.current = [];
    candleDataRef.current = [];
    roundRef.current = 1;
    balanceRef.current = 1000;

    // Reset finishedDates (if needed)
    Object.keys(finishedDates.current).forEach((key) => {
      finishedDates.current[key] = [];
    });

    // Reset chart data
    const chart = chartRef.current?.chart;
    if (chart) {
      chart.series[0].setData([], true); // candle
      chart.series[1].setData([], true); // avg line
      chart.annotations?.forEach((a) => a.destroy()); // remove annotations
    }

    // Reset state variables
    setSymbol(null);
    setRandomNumber(null);
    setStartingPrice(null);
    setPriceData([]);
    setBalance(balanceRef.current);
    // setCandleData([]);
    setMinPrice(null);
    setMaxPrice(null);
    setGainLoss(null);
    setTradeRunning(false);

    await getData();
    chart.redraw();
  }

  function updateLeaderboard(name, score) {
    const leaderboardKey = "leaderboard_data";

    // Load current leaderboard from localStorage
    const stored = localStorage.getItem(leaderboardKey);
    const leaderboard = stored ? JSON.parse(stored) : [];

    console.log("leaderbaord", leaderboard);
    // Only add if score is greater than any current entry
    const hasHigher = leaderboard.some((entry) => score > entry.score);

    if (hasHigher || leaderboard.length === 0) {
      // Add new entry
      const updated = [...leaderboard, { name, score }];

      // Optional: sort descending by score
      updated.sort((a, b) => b.score - a.score);

      // Optional: trim to top 10
      const trimmed = updated.slice(0, 10);

      // Save to localStorage
      localStorage.setItem(leaderboardKey, JSON.stringify(trimmed));
    }
  }

  //Handler for opening and closing dialog
  function handleDialogOpen() {
    setDialogOpen(true);
  }
  function handleDialogClose() {
    //close dialog, reset game
    setDialogOpen(false);
    //Update Leaderboard
    //Reset game
    window.location.reload();
    // priceAvgsRef.current = [];
    // futurePriceAvgsRef.current = [];
    // candleDataRef.current = [];
    // futureCandleDataRef.current = [];
    // roundRef.current = 1;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: 4,
        display: "flex", // Flexbox layout
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
      }}
    >
      <FinishDialog
        open={dialogOpen}
        onSubmit={(name) => updateLeaderboard(name, balance)}
        handleClose={handleDialogClose}
        balance={balance}
        passed={passed}
      ></FinishDialog>
      <>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "90vw",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "60vw",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Paper
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                mr: 5,
                py: 2,
              }}
            >
              <Typography>Position Type</Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  borderBottom: 1,
                  my: 2,
                }}
              >
                <Button
                  variant={posType === "long" ? "contained" : "outlined"}
                  color="success"
                  onClick={() => setPosType("long")}
                  sx={{
                    "&:hover": {
                      backgroundColor: "green",
                      color: secondaryColor,
                    },
                    mr: 4,
                    my: 2,
                  }}
                >
                  Long
                </Button>
                <Button
                  variant={posType === "short" ? "contained" : "outlined"}
                  color="error"
                  onClick={() => setPosType("short")}
                  sx={{
                    "&:hover": {
                      backgroundColor: "red",
                      color: secondaryColor,
                    },
                  }}
                >
                  Short
                </Button>
              </Box>
              <Typography>Position Size</Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  borderBottom: 1,
                  my: 2,
                  py: 2,
                }}
              >
                ${" "}
                <TextField
                  label="Amount"
                  type="number"
                  variant="outlined"
                  value={posSize}
                  onChange={posSizeChangeHandler}
                />
              </Box>
              <Typography>Trade!</Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  my: 2,
                  py: 2,
                }}
              >
                <Button
                  variant="outlined"
                  color="success"
                  onClick={handleTradeClick}
                  disabled={!posSize || !posType || tradeRunning || tradePaused}
                  sx={{
                    "&:hover": {
                      backgroundColor: "green",
                      color: secondaryColor,
                    },
                    my: 3,
                  }}
                >
                  Let's Trade!
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleCloseClick}
                  disabled={!tradeRunning}
                  sx={{
                    "&:hover": {
                      backgroundColor: "red",
                      color: secondaryColor,
                    },
                  }}
                >
                  Close Position
                </Button>
                <Button
                  variant="outlined"
                  color="blue"
                  onClick={handleNextClick}
                  disabled={!tradePaused}
                  sx={{
                    "&:hover": {
                      backgroundColor: "blue",
                      color: secondaryColor,
                    },
                    my: 3,
                  }}
                >
                  Next Trade
                </Button>
              </Box>
            </Paper>
          </Box>
          <Box sx={{ width: "80%" }}>
            <HighchartsReact
              highcharts={Highcharts}
              constructorType={"stockChart"}
              options={options}
              ref={chartRef}
              containerProps={{ style: { width: "100%", height: "60vh" } }}
            />
            {/* <StatsPanel /> */}
            <Box
              sx={{
                display: "inline-flex",
                flexDirection: "row",
                width: "50vw",
                justifyContent: "flex-start",
                flexWrap: "wrap",
                gap: 2,
                mt: 2,
              }}
            >
              <Paper
                sx={{
                  display: "flex",
                  width: "20vw",
                  height: "5vh",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  m: 2,
                  p: 1,
                }}
              >
                Balance: {balance.toFixed(2)}
              </Paper>
              <Paper
                sx={{
                  display: "flex",
                  width: "20vw",
                  height: "5vh",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  m: 2,
                  p: 1,
                  color: gainLoss >= 0 ? "green" : "red",
                }}
              >
                Gain/Loss: {gainLoss.toFixed(2)}
              </Paper>

              <LeaderboardHover sx={{ width: "10vw" }} />
              <CheatSheetsHover sx={{ width: "10vw" }} />
            </Box>
          </Box>
        </Box>
      </>
    </Box>
  );
}

export default App;
