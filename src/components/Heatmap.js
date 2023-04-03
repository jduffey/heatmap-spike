import React from 'react';
import Plot from 'react-plotly.js';

const xTicks = Array.from({ length: 20 }, (_, i) => (i * .05).toFixed(3));
const yTicks = Array.from({ length: 100 }, (_, i) => (i * 10).toFixed(2));

export default function Heatmap({ data, totalDollarAmount }) {
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