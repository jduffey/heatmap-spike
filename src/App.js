import React, { useState, useEffect } from 'react';

import DataTable from './components/DataTable';
import Heatmap from './components/Heatmap';

const BIN_SIZE = {
    maxPayoutMultiplier: 10,
    minHouseEdge: 0.05,
}
const DATA_POINTS = 1000;

function App() {
    const [heatmapData, setHeatmapData] = useState([]);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        generateRandomData();
    }, []);

    function createEmptyHeatmapData() {
        return Array.from({ length: 11 }, () => Array.from({ length: 21 }, () => 0));
    }

    function generateRandomDataPoint() {
        const minHouseEdge = Math.ceil(Math.random() * 1000) / 1000;
        const maxPayoutMultiplier = Math.floor(Math.random() * 100) + 1;
        const dollarAmount = Math.floor(Math.random() * 99 + 1) * 10;
        return { minHouseEdge, maxPayoutMultiplier, dollarAmount };
    }

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

        setHeatmapData(dataForHeatmap);
        setTableData(dataForTable);
    }

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
