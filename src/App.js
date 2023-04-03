import React, { useMemo, useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { useTable, useSortBy } from 'react-table';

function App() {
    const [heatmapData, setHeatmapData] = useState([]);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        generateRandomData();
    }, []);

    function generateRandomData() {
        let dataForHeatmap = Array.from({ length: 20 }, () =>
            Array.from({ length: 10 }, () => 0)
        );
        let dataForTable = [];

        for (let i = 0; i < 500; i++) {
            let minHouseEdge;
            let maxPayoutMultiplier;

            minHouseEdge = Math.random(); // 0 to 1
            maxPayoutMultiplier = Math.floor(Math.random() * 100) + 1; // 1 to 100, increments of 1

            let dollarAmount = Math.floor(Math.random() * 99 + 1) * 10;

            let xIndex = Math.floor(minHouseEdge / 0.05);
            let yIndex = Math.floor(maxPayoutMultiplier / 10);

            // Accumulate the dollar amounts for bins less than or equal to the current indices
            for (let xi = 0; xi < xIndex; xi++) {
                for (let yi = 0; yi < yIndex; yi++) {
                    // console.log('xi', xi, 'yi', yi, 'dollarAmount', dollarAmount);
                    dataForHeatmap[xi][yi] += dollarAmount;

                    // check every value in dataForHeatmap to make sure it's not NaN
                    if (isNaN(dataForHeatmap[xi][yi])) {
                        console.log('dataForHeatmap[xi][yi] is NaN', dataForHeatmap[xi][yi]);
                        console.log('xi', xi, 'yi', yi, 'dollarAmount', dollarAmount);
                    }
                }
            }

            dataForTable.push({ minHouseEdge, maxPayoutMultiplier, dollarAmount });
        }

        setHeatmapData(dataForHeatmap);
        setTableData(dataForTable);
    }

    const xTicks = Array.from({ length: 10 }, (_, i) => (i * 0.1).toFixed(2));
    const yTicks = Array.from({ length: 10 }, (_, i) => (i * 5).toFixed(0));

    // console.log('xTicks', xTicks);
    // console.log('yTicks', yTicks);

    const columns = useMemo(
        () => [
            {
                Header: 'Minimum House Edge',
                accessor: 'minHouseEdge',
                Cell: ({ value }) => value.toFixed(4),
                sortType: (a, b) => a.original.minHouseEdge - b.original.minHouseEdge,
            },
            {
                Header: 'Maximum Payout Multiplier',
                accessor: 'maxPayoutMultiplier',
            },
            {
                Header: 'Dollar Amount',
                accessor: 'dollarAmount',
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data: tableData }, useSortBy);

    const totalDollarAmount = tableData.reduce((sum, row) => sum + row.dollarAmount, 0);
    console.log(heatmapData);

    return (
        <div className="App">
            <Plot
                data={[
                    {
                        z: heatmapData,
                        x: xTicks,
                        y: yTicks,
                        type: 'heatmap',
                        colorscale: [
                            [0, 'white'],
                            [0.0001, 'rgb(0,0,131)'],
                            [0.125, 'rgb(0,60,170)'],
                            [0.375, 'rgb(5,255,255)'],
                            [0.625, 'rgb(255,255,0)'],
                            [0.875, 'rgb(250,0,0)'],
                            [1, 'rgb(128,0,0)'],
                        ],
                        zmin: 0,
                        // zmax: totalDollarAmount, // This is implied so no need to set
                    },
                ]}
                layout={{
                    width: 1200,
                    height: 800,
                    title: `Minimum House Edge vs. Maximum Payout Multiplier<br>Total Deposits $${totalDollarAmount}`,
                    xaxis: {
                        title: 'Minimum House Edge<br><-- Player   ADVANTAGE   House -->',
                        dtick: 0.05,
                        range: [-.1, 1.1],
                    },
                    yaxis: {
                        title: 'Maximum Payout Multiplier<br><-- Lower   VARIANCE   Higher -->',
                        dtick: 10,
                        range: [-50, 150],
                    },
                }}
            />

            <div>
                <table {...getTableProps()} style={{ width: '100%', margin: '20px auto' }}>
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        style={{
                                            borderBottom: 'solid 3px #aaa',
                                            background: '#f1f1f1',
                                            color: 'black',
                                            fontWeight: 'bold',
                                            padding: '8px',
                                            textAlign: 'left',
                                        }}
                                    >
                                        {column.render('Header')}
                                        <span>
                                            {column.isSorted
                                                ? column.isSortedDesc
                                                    ? ' 🔽'
                                                    : ' 🔼'
                                                : ''}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => {
                                        return (
                                            <td
                                                {...cell.getCellProps()}
                                                style={{
                                                    padding: '8px',
                                                    borderBottom: 'solid 1px #aaa',
                                                }}
                                            >
                                                {cell.render('Cell')}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default App;

