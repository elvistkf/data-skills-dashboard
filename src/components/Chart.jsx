import React from 'react';
import styled from 'styled-components';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Title } from 'chart.js';
import { Bar } from 'react-chartjs-2';
// import Col from 'react-bootstrap/Col';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Title)

// const ReponseiveCol = styled(Col)`
//   min-width: 0;
// `

const ReponseiveCol = styled.div`
  /* min-width: 35%; */
  flex-basis: 30%;
  height: 30vh;

  @media screen and (min-width: 1200px){
    flex-basis: 35%;
  }
`

const invertAxis = (axis) => {
    return axis === "x" ? "y" : "x";
}

function Chart(props) {
    const indexAxis = props.indexAxis || "x";
    const scaleAxis = invertAxis(indexAxis)
    const option = {
        indexAxis: indexAxis,
        responsive: true,
        maintainAspectRatio: false,
        // aspectRatio: 2,
        elements: {
            bar: {
                borderWidth: 2,
            },
        },
        scales: {
            [scaleAxis]: {
                ticks: {
                    min: 0,
                    max: 100,
                    callback: value => value + (props.showPercentage ? "%" : "")
                }
            }
        },
        plugins: {
            title: {
                display: props.title ? true : false,
                text: props.title || "",
                font: {
                    'size': 16
                }
            },
            tooltip: {
                callbacks: {
                    label: context => (context.dataset.label || '') + " " + (context.parsed[scaleAxis]) + (props.showPercentage ? "%" : "")
                }
            }
        }
    };

    const data = {
        labels: Object.keys(props.data),
        datasets: [{
            // label: 'Canada',
            barPercentage: indexAxis === "x" ? 0.7 : 0.95,
            data: Object.values(props.data).map(num => Math.round(num * 100) / 100),
            backgroundColor: 'rgba(35, 91, 243, 0.7)',
        }
        ],
        borderWidth: 1
    }
    return (
        <ReponseiveCol>
            <Bar options={option} data={data} />
        </ReponseiveCol>
    )
}

export default Chart