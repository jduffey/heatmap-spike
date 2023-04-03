import React, { useState, useEffect } from 'react';

import DataTable from './components/DataTable';
import Heatmap from './components/Heatmap';

function App() {
    const [heatmapData, setHeatmapData] = useState([]);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        generateRandomData();
    }, []);

    function generateRandomData() {
        const dataForHeatmap =
            Array.from({ length: 10 }, () =>
                Array.from({ length: 20 }, () => 0)
            );
        const dataForTable = [];

        for (let i = 0; i < 500; i++) {
            const minHouseEdge = Math.random(); // 0 to 1
            const maxPayoutMultiplier = Math.floor(Math.random() * 100) + 1; // 1 to 100, increments of 1

            const dollarAmount = Math.floor(Math.random() * 99 + 1) * 10;

            const xIndex = Math.floor(maxPayoutMultiplier / 10);
            const yIndex = Math.floor(minHouseEdge / 0.05);

            // Accumulate the dollar amounts for bins less than or equal to the current indices
            for (let xi = 0; xi < xIndex; xi++) {
                for (let yi = 0; yi < yIndex; yi++) {
                    dataForHeatmap[xi][yi] += dollarAmount;
                }
            }

            dataForTable.push({ minHouseEdge, maxPayoutMultiplier, dollarAmount });
        }

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

