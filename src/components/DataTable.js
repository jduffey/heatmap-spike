import React from 'react';
import { useTable, useSortBy } from 'react-table';

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

export default function DataTable({ data }) {
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
