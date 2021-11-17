import { Bar } from "react-chartjs-2";
import './BarChart.css';

const BarChart = (props) => {
return (
	<div className="bar-chart">
		<Bar
		data={{
			// Name of the variables on x-axies for each bar
			labels: ["1", "2", "3", "4", "5"],
			datasets: [
			{
				// Label for bars
				label: "total vote/level",
				// Data or value of your each variable
				data: props.data,
				// Color of each bar
				backgroundColor: ["red", "orange", "yellow", "skyblue", "green"],
				// Border color of each bar
				borderColor: ["aqua", "green", "red", "yellow"],
				borderWidth: 0.1,
			},
			],
		}}
		// Height of graph
		height={400}
		options={{
			maintainAspectRatio: false
		}}
		/>
	</div>
);
}

export default BarChart;
