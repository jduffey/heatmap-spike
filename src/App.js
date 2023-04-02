import React, { useMemo, useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { useTable, useSortBy } from 'react-table';

function App() {
    const [data, setData] = useState([]);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        generateRandomData();
    }, []);

    function generateRandomData() {
        let heatmapData = Array.from({ length: 20 }, () =>
            Array.from({ length: 10 }, () => 0)
        );
        let tableData = [];

        for (let i = 0; i < 100; i++) {
            let minHouseEdge;
            let maxPayoutMultiplier;

            // Generate a biased random value for minHouseEdge
            if (Math.random() < 0.05) {
                minHouseEdge = 0.05 + Math.random() * 0.1; // Range of 0.05 to 0.15
            } else {
                minHouseEdge = Math.random();
            }

            // Generate a biased random value for maxPayoutMultiplier
            if (Math.random() < 0.05) {
                maxPayoutMultiplier = Math.floor(Math.random() * 40) + 10; // Range of 10 to 50
            } else {
                maxPayoutMultiplier = Math.floor(Math.random() * 100) + 1;
            }

            let dollarAmount = Math.floor(Math.random() * 99 + 1) * 10;

            let xIndex = Math.floor(minHouseEdge / 0.05);
            let yIndex = Math.floor(maxPayoutMultiplier / 10);

            // Accumulate the dollar amounts for bins less than or equal to the current indices
            for (let xi = 0; xi <= xIndex; xi++) {
                for (let yi = 0; yi <= yIndex; yi++) {
                    heatmapData[xi][yi] += dollarAmount;
                }
            }

            tableData.push({ minHouseEdge, maxPayoutMultiplier, dollarAmount });
        }

        setData(heatmapData);
        setTableData(tableData);
    }

    const minHouseEdgeTicks = Array.from({ length: 20 }, (_, i) => (i * 0.1).toFixed(2));
    const maxPayoutMultiplierTicks = Array.from({ length: 10 }, (_, i) => i * 5);

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

    return (
        <div className="App">
            <Plot
                data={[
                    {
                        z: data,
                        x: minHouseEdgeTicks,
                        y: maxPayoutMultiplierTicks,
                        type: 'heatmap',
                        colorscale: [
                            [0, 'white'],
                            [0.0001, 'blue'],
                            [1, 'yellow'],
                        ],
                        zmin: 0,
                        // zmax: 1000, // Don't bound this because it should expand based on the dollar amounts
                    },
                ]}
                layout={{
                    title: 'Minimum House Edge vs. Maximum Payout Multiplier',
                    xaxis: {
                        title: 'Minimum House Edge<br><-- Player   ADVANTAGE   House -->',
                        dtick: 0.05,
                        range: [0, 1],
                    },
                    yaxis: {
                        title: 'Maximum Payout Multiplier<br><-- Lower   VARIANCE   Higher -->',
                        dtick: 10,
                        range: [0, 100],
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

