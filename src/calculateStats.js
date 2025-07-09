import { useState, useEffect, useRef } from "react";

export function calculateStats(posSize, startingPrice, open, close, posType) {
    let gainLoss = 0;

    function calcAverage(num1, num2) {
        return (num1 + num2) / 2
    }
    let currPrice = calcAverage(open, close);

    function calcGainLoss(posSize, startingPrice, newPrice) {
        let gainLoss = 0
        //Multiply the position size by the ratio of the starting price and new (current) price
        if (posType == 'short') {
            gainLoss = (posSize * (startingPrice / newPrice)) - posSize;
        }
        else if (posType == 'long') {
            gainLoss = (posSize * (newPrice / startingPrice)) - posSize;
        }

        return gainLoss
    }

    return(calcGainLoss(posSize, startingPrice, currPrice));
    





}