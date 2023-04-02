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
        let heatmapData = Array.from({ length: 21 }, () =>
            Array.from({ length: 10 }, () => 0)
        );
        let tableData = [];

        for (let i = 0; i < 100; i++) {
            let minHouseEdge = Math.random();
            let maxPayoutMultiplier = Math.floor(Math.random() * 100) + 1;
            let dollarAmount = Math.floor(Math.random() * 99 + 1) * 10;

            let xIndex = Math.floor(minHouseEdge / 0.05);
            let yIndex = Math.floor(maxPayoutMultiplier / 10);

            heatmapData[xIndex][yIndex] += dollarAmount;
            tableData.push({ minHouseEdge, maxPayoutMultiplier, dollarAmount });
        }

        setData(heatmapData);
        setTableData(tableData);
    }

    const xTicks = Array.from({ length: 21 }, (_, i) => (i * 0.05).toFixed(2));
    const yTicks = Array.from({ length: 11 }, (_, i) => i * 10);

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
                        x: xTicks,
                        y: yTicks,
                        type: 'heatmap',
                        colorscale: [
                            [0, 'blue'],
                            [1, 'yellow'],
                        ],
                    },
                ]}
                layout={{
                    title: 'Minimum House Edge vs. Maximum Payout Multiplier',
                    xaxis: { title: 'Minimum House Edge', dtick: 0.05 },
                    yaxis: { title: 'Maximum Payout Multiplier', dtick: 10 },
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

