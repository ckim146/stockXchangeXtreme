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



const LEADERBOARD_KEY = 'leaderboard_data';

function Leaderboard({ leaderboard }) {

    return (
        <Paper
            sx={{
                p: 2,
                width: 300,
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
            <Typography variant="h6" align="center" gutterBottom>
                Leaderboard
            </Typography>
            <List>
                {leaderboard.length === 0 && (
                    <Typography variant="body2" align="center" color="text.secondary">
                        No scores yet
                    </Typography>
                )}
                {leaderboard.map(({ name, score }, i) => (
                    <ListItem key={`${name}-${score}-${i}`} divider>
                        <ListItemText primary={name} />
                        <Typography fontWeight="bold">{score}</Typography>
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
}

export default function LeaderboardHover() {
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [leaderboard, setLeaderboard] = useState(() => {
        const stored = localStorage.getItem(LEADERBOARD_KEY);
        return stored ? JSON.parse(stored) : [];
    });
    

    return (
        <Box
            sx={{ position: 'relative', height: '100vh',  }}
            onMouseEnter={() => setShowLeaderboard(true)}
            onMouseLeave={() => setShowLeaderboard(false)}
        >
            <Button variant="contained" color="inherit" sx={{ mt: 0, ml: 4, bgcolor: 'background.paper' }}>
                Leaderboard
            </Button>

            {showLeaderboard && <Leaderboard leaderboard={leaderboard} />}
        </Box>
    );
}
