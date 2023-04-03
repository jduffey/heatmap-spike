import React, { useState, useEffect } from 'react';

import DataTable from './components/DataTable';
import Heatmap from './components/Heatmap';

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
        const minHouseEdge = Math.random(); // 0 to 1
        const maxPayoutMultiplier = Math.floor(Math.random() * 100) + 1; // 1 to 100, increments of 1
        const dollarAmount = Math.floor(Math.random() * 99 + 1) * 10;
        return { minHouseEdge, maxPayoutMultiplier, dollarAmount };
    }

    function generateRandomData() {
        const dataForHeatmap = createEmptyHeatmapData();
        const dataForTable = Array.from({ length: 100 }, () => generateRandomDataPoint());

        dataForTable.forEach(({ minHouseEdge, maxPayoutMultiplier, dollarAmount }) => {
            const yIndex = Math.floor(maxPayoutMultiplier / 10);
            const xIndex = Math.floor(minHouseEdge / 0.05);

            console.log(minHouseEdge, maxPayoutMultiplier, dollarAmount, xIndex, yIndex);

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

    const totalDollarAmount = tableData.reduce((sum, row) => sum + row.dollarAmount, 0);

    return (
        <div className="App">
            <Heatmap data={heatmapData} totalDollarAmount={totalDollarAmount} />
            <DataTable data={tableData} />
        </div>
    );
}

export default App;
