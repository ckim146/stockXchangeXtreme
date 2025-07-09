import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useState, useEffect, useRef } from "react";


export function StatsPanel (props){

    const [gainLoss, setGainLoss] = useState(0);


    return (
        <GainLossContext.Provider value={{ gainLoss, setGainLoss }}>
        <Box sx={{ display: 'inline-flex', flexDirection: 'row', width: '50vw', justifyContent: 'flex-start', flexWrap: 'wrap', gap: 2, mt: 2 }}>
            <Paper sx={{ display: "flex", width: '20vw', height: '5vh', justifyContent: 'flex-start', alignItems: 'center', m: 2, p: 1 }}>Balance:</Paper>
            <Paper sx={{ display: "flex", width: '20vw', height: '5vh', justifyContent: 'flex-start', alignItems: 'center', m: 2, p: 1 }}>Gain/Loss: {gainLoss}</Paper>
            <Paper sx={{ display: "flex", width: '40vw', height: '5vh', justifyContent: 'flex-start', alignItems: 'center', m: 2, p: 1 }}>Current Position: </Paper>
        </Box>
        </GainLossContext.Provider>
    );
}