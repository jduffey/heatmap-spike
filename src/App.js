import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { useTable, useSortBy } from 'react-table';

const xTicks = Array.from({ length: 20 }, (_, i) => (i * .05).toFixed(3));
const yTicks = Array.from({ length: 100 }, (_, i) => (i * 10).toFixed(2));

const columns = [
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
];

function Heatmap({ data, totalDollarAmount }) {
    return (
        <Plot
            data={[
                {
                    z: data,
                    x: xTicks,
                    y: yTicks,
                    type: 'heatmap',
                    colorscale: [
                        [0, 'lightgray'],
                        [0.0001, 'rgb(0,0,131)'],
                        [0.125, 'rgb(0,60,170)'],
                        [0.375, 'rgb(5,255,255)'],
                        [0.625, 'rgb(255,255,0)'],
                        [0.875, 'rgb(250,0,0)'],
                        [1, 'rgb(128,0,0)'],
                    ],
                    zmin: 0,
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
    );
}

function DataTable({ data }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data }, useSortBy);

    return (
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
    );
}

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

