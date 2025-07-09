import React, { useState } from 'react';
import {
    Box,
    Button,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
// import Image from 'mui-image'

function ChartPattern() {
    return (
        <Paper
            sx={{
                p: 1,
                width: 600,
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',

                zIndex:99999,
                bgcolor: 'background.paper',
                boxShadow: 6,
                borderRadius: 2,
                border: '2px solid white'
            }}
        >
            {/* <Typography variant="h6" align="center" gutterBottom>
                Chart Patterns
            </Typography> */}
            <img src="https://d2joxxgq39wu1j.cloudfront.net/2023/imgs/education/trading-charts.jpg" />
        </Paper>
    );
}

function CandlePattern() {
    return (
        <Paper
            sx={{
                p: 1,
                width: 600,
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',

                zIndex:99999,
                bgcolor: 'background.paper',
                boxShadow: 6,
                borderRadius: 2,
                border: '2px solid white'
            }}
        >
            {/* <Typography variant="h6" align="center" gutterBottom>
                Chart Patterns
            </Typography> */}
            <img src="https://imagedelivery.net/4-5JC1r3VHAXpnrwWHBHRQ/f1c40382-0caa-4639-c1cd-7fea6c7d7a00/public" />
        </Paper>
    );
}


export default function CheatSheetsHover() {
    const [showChartPatterns, setShowChartPatterns] = useState(false);
    const [showCandlePatterns, setShowCandlePatterns] = useState(false);
    

    return (
        <Box
            sx={{ position: 'relative'  }}
        >
            <Button 
            variant="contained" color="inherit" 
            onMouseEnter={() => setShowChartPatterns(true)}
            onMouseLeave={() => setShowChartPatterns(false)} 
            sx={{ mt: 0, ml: 4, bgcolor: 'background.paper' }}>
                Chart Patterns
            </Button>

            <Button variant="contained" color="inherit" 
            onMouseEnter={() => setShowCandlePatterns(true)}
            onMouseLeave={() => setShowCandlePatterns(false)} 
            sx={{ mt: 0, ml: 4, bgcolor: 'background.paper' }}>
                Candle Patterns
            </Button>

            {showChartPatterns && <ChartPattern/>}
            {showCandlePatterns && <CandlePattern/>}
        </Box>
    );
}
