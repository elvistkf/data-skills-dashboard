import React from 'react';
import styled from 'styled-components';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Title } from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Title)

// let draw = BarController.prototype.draw;
// BarController.prototype.draw = function () {
// 	draw.apply(this, arguments);
// 	let ctx = this._ctx;
// 	let _fill = ctx.fill;
// 	ctx.fill = function () {
// 		const includeList = ["#36a2eb"]
// 		// let ignoreList = [];
// 		ctx.save()
// 		if (includeList.includes(ctx.fillStyle)) {
// 			console.log(ctx.fillStyle)	

// 			ctx.shadowColor = "#123a55"
// 			ctx.shadowBlur = 25;
// 			ctx.shadowOffsetX = -1;
// 			ctx.shadowOffsetY = -1;
// 		}
// 		_fill.apply(this, arguments)
// 		ctx.restore();
// 	}
// }

const ReponseiveCol = styled.div`
	background-color: #fbfbfb;
	border-radius: 1em;
	box-shadow: 2px 3px #dddddd;
	margin: 0.5em;
	padding: 1em;
	flex-basis: 32%;
  	height: 35vh;

	@media screen and (max-width: 1440px){
		flex-basis: 31.9%;
		height: 37.5vh;
	}

  	@media screen and (max-width: 1366px){
    	flex-basis: 48%;
  	}

	@media screen and (max-width: 1200px) {
		flex-basis: 45%;
	}

	@media screen and (max-width: 700px) {
    	flex-basis: 100%;
  	}
`

const invertAxis = (axis) => {
	return axis === "x" ? "y" : "x";
}

function BarChart(props) {
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
					callback: value => value + (props.showPercentage ? "%" : ""),
				},
			},
			[indexAxis]: {
				ticks: {
					font: {
						size: 12
					}
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
					title: context => {
						return context[0].label.split(",").join(" ")
					},
					// label: context => " " + (context.dataset.label || '') + " " + (context.parsed[scaleAxis]) + (props.showPercentage ? "%" : ""),
					label: context => ` ${context.dataset.label || ""}: ${context.parsed[scaleAxis] + (props.showPercentage ? "%" : "")}`
					// beforeBody: context => context[0].parsed[scaleAxis] + (props.showPercentage ? "%" : ""),
					// label: () => null,
				}
			},
		}
	};

	let dataset = [];

	const dataset_da = {
		label: "Data Analyst",
		barPercentage: indexAxis === "x" ? 0.8 : 0.95,
		data: Object.values(props.data).map(obj => Math.round(obj["Data Analyst"] * 100) / 100),
		backgroundColor: Object.values(props.data).map((num, idx) => idx < 3 ? 'rgba(54, 162, 235, 0.5)' : 'rgba(135, 135, 200, 0.5)'),
		borderColor: Object.values(props.data).map((num, idx) => idx < 3 ? "#36a2eb" : "#ffffff")
	}

	if (dataset_da.data.reduce((a,b) => a || 0 + b || 0, 0) > 0) {
		dataset.push(dataset_da)
	}

	const dataset_ds = {
		label: "Data Scientist",
		barPercentage: indexAxis === "x" ? 0.8 : 0.95,
		data: Object.values(props.data).map(obj => Math.round(obj["Data Scientist"] * 100) / 100),
		backgroundColor: Object.values(props.data).map((num, idx) => idx < 3 ? 'rgba(200, 35, 35, 0.5)' : 'rgba(200, 135, 135, 0.5)'),
		borderColor: Object.values(props.data).map((num, idx) => idx < 3 ? "#b17575" : "#ffffff")
	}
	if (dataset_ds.data.reduce((a,b) => a || 0 + b || 0, 0) > 0) {
		dataset.push(dataset_ds)
	}

	const data = {
		labels: Object.keys(props.data).map(label => label === "Power BI" ? label : label.split(" ")),
		datasets: dataset,
		borderWidth: 1
	}

	return (
		<ReponseiveCol>
			<Bar options={option} data={data} />
		</ReponseiveCol>
	)
}

export default BarChart