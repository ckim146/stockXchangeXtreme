import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    TextField,
    Box
} from '@mui/material';

export function FinishDialog(props) {
    const [playerName, setPlayerName] = useState('');
    const balance = props.balance
    const dialogMessage = props.passed ? `Your final balance is: ${balance.toFixed(2)}. Enter your name to see if you made it to the leaderboard` : "You blew your account!"

    function handleConfirm() {
        if (playerName.trim()) {
            props.onSubmit(playerName, balance);
            setPlayerName('');
        }
        props.handleClose();
    };

    return (
        <Dialog open={props.open} onClose={props.handleClose}>
            <DialogTitle>Trades Complete</DialogTitle>
            <DialogContent dividers>
                <Typography variant="body1">
                    {dialogMessage}
                </Typography>
                {props.passed && (
                    <Box display="flex" justifyContent="center">
                        <TextField placeholder="Enter your name" onChange={(e) => setPlayerName(e.target.value)} />
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleConfirm} variant="contained" color="success">
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    )
}