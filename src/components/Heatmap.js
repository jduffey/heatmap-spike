import React from 'react';
import Plot from 'react-plotly.js';

const minHouseEdgeTicks = Array.from({ length: 10 }, (_, i) => (i * 10).toFixed(2));
const maxPayoutMultiplierTicks = Array.from({ length: 20 }, (_, i) => (i * 0.05).toFixed(3));

const colorscale = [
    [0, 'rgb(0,0,131)'],
    [0.125, 'rgb(0,60,170)'],
    [0.375, 'rgb(5,255,255)'],
    [0.625, 'rgb(255,255,0)'],
    [0.875, 'rgb(250,0,0)'],
    [1, 'rgb(128,0,0)'],
];

function formatDollarAmount(amount) {
    if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(1)}m`;
    } else if (amount >= 1000) {
        return `${(amount / 1000).toFixed(1)}k`;
    } else {
        return `${amount}`;
    }
}

// lerp = "linear interpolation"
function lerp(a, b, t) {
    return a + (b - a) * t;
}

// Note that this function is used to decide the text color.
// It assumes that Plotly is using linear interpolation on the colorscale.
function interpolateColor(color1, color2, t) {
    const rgb1 = color1.match(/\d+/g).map(Number);
    const rgb2 = color2.match(/\d+/g).map(Number);

    const r = Math.round(lerp(rgb1[0], rgb2[0], t));
    const g = Math.round(lerp(rgb1[1], rgb2[1], t));
    const b = Math.round(lerp(rgb1[2], rgb2[2], t));

    return `rgb(${r},${g},${b})`;
}

function getActualColor(value, minValue, maxValue) {
    const t = (value - minValue) / (maxValue - minValue);

    for (let i = 0; i < colorscale.length - 1; i++) {
        if (t >= colorscale[i][0] && t <= colorscale[i + 1][0]) {
            const tInSegment = (t - colorscale[i][0]) / (colorscale[i + 1][0] - colorscale[i][0]);
            return interpolateColor(colorscale[i][1], colorscale[i + 1][1], tInSegment);
        }
    }
    return colorscale[colorscale.length - 1][1];
}

// h/t https://stackoverflow.com/a/3943023/112731
function getTextColor(value, minValue, maxValue) {
    const actualColor = getActualColor(value, minValue, maxValue);
    const [r, g, b] = actualColor.match(/\d+/g).map(Number);

    const brightness = r * 0.2126 + g * 0.7552 + b * 0.1922;

    return brightness > 186 ? 'black' : 'white';
}

export default function Heatmap({ data, totalDollarAmount, countOfDataPoints }) {
    const minValue = Math.min(...data.flat());
    const maxValue = Math.max(...data.flat());

    const annotations = data.flatMap((row, yIndex) =>
        row.map((value, xIndex) => {
            const textColor = getTextColor(value, minValue, maxValue);
            return {
                x: maxPayoutMultiplierTicks[xIndex],
                y: minHouseEdgeTicks[yIndex],
                text: formatDollarAmount(value),
                font: {
                    size: 12,
                    color: textColor,
                },
                showarrow: false,
            };
        })
    );

    return (
        <Plot
            data={[
                {
                    z: data,
                    y: minHouseEdgeTicks,
                    x: maxPayoutMultiplierTicks,
                    type: 'heatmap',
                    colorscale: colorscale,
                    zmin: 0,
                },
            ]}
            layout={{
                width: 1200,
                height: 800,
                title: `Minimum House Edge vs. Maximum Payout Multiplier<br>Total Deposits $${totalDollarAmount}, n=${countOfDataPoints}`,
                xaxis: {
                    title: 'Minimum House Edge<br><-- House   ADVANTAGE   Player -->',
                    dtick: 0.05,
                    range: [1.025, -0.025],
                },
                yaxis: {
                    title: 'Maximum Payout Multiplier<br><-- Lower   VARIANCE   Higher -->',
                    dtick: 10,
                    range: [-5, 105],
                },
                annotations: annotations,
            }}
        />
    );
}
