import React, { useState, useEffect } from 'react';

import DataTable from './components/DataTable';
import Heatmap from './components/Heatmap';

const BIN_SIZE = {
    maxPayoutMultiplier: 10,
    minHouseEdge: 0.05,
}
const DATA_POINTS = 100;
const HOUSE_EDGE = {
    min: 0.05,
    max: 1,
    step: 0.05,
}
const PAYOUT_MULTIPLIER = {
    min: 5, // If this 1 then the max resulting data point is only 96, hmm...
    max: 100,
    step: 5,
}
const DOLLAR_AMOUNT = {
    min: 10,
    max: 1000,
    step: 10,
}

function createEmptyHeatmapData() {
    return Array.from({ length: 11 }, () => Array.from({ length: 21 }, () => 0));
}

function generateRandomDataPoint() {
    const minHouseEdge =
        Math.floor(Math.random() * (HOUSE_EDGE.max / HOUSE_EDGE.step)) * HOUSE_EDGE.step + HOUSE_EDGE.min;
    const maxPayoutMultiplier =
        Math.floor(Math.random() * (PAYOUT_MULTIPLIER.max / PAYOUT_MULTIPLIER.step)) * PAYOUT_MULTIPLIER.step + PAYOUT_MULTIPLIER.min;
    const dollarAmount =
        Math.floor(Math.random() * (DOLLAR_AMOUNT.max / DOLLAR_AMOUNT.step)) * DOLLAR_AMOUNT.step + DOLLAR_AMOUNT.min;

    return { minHouseEdge, maxPayoutMultiplier, dollarAmount };
}

function App() {
    const [heatmapData, setHeatmapData] = useState([]);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        function generateRandomData() {
            const dataForHeatmap = createEmptyHeatmapData();
            const dataForTable = Array.from({ length: DATA_POINTS }, () => generateRandomDataPoint());

            dataForTable.forEach(({ minHouseEdge, maxPayoutMultiplier, dollarAmount }) => {
                const yIndex = Math.floor(maxPayoutMultiplier / BIN_SIZE.maxPayoutMultiplier);
                const xIndex = Math.floor(minHouseEdge / BIN_SIZE.minHouseEdge);

                // Accumulate the dollar amounts for bins less than or equal to the current indices
                for (let xi = 0; xi <= xIndex; xi++) {
                    for (let yi = 0; yi <= yIndex; yi++) {
                        dataForHeatmap[yi][xi] += dollarAmount;
                    }
                }
            });

            return { dataForHeatmap, dataForTable };
        }

        const { dataForHeatmap, dataForTable } = generateRandomData();
        setHeatmapData(dataForHeatmap);
        setTableData(dataForTable);
    }, []);

    const totalDollarAmount = tableData.reduce((acc, dataPoint) => acc + dataPoint.dollarAmount, 0);
    const countOfDataPoints = tableData.length;

    return (
        <div className="App">
            <Heatmap data={heatmapData} totalDollarAmount={totalDollarAmount} countOfDataPoints={countOfDataPoints} />
            <DataTable data={tableData} />
        </div>
    );
}

export default App;
