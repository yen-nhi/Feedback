import { useEffect, useState, useContext } from "react";
import { Bar } from "react-chartjs-2";
import './BarChart.css';
import useFetch from "../hooks/use-fetch";
import { useParams } from "react-router-dom";
import EndpointContext from '../store/api-endpoint';


const BarChart = (props) => {
	const params = useParams();
	const { isLoading, hasError, recievedData, fetchData } = useFetch();
	const apiRoot = useContext(EndpointContext);


	useEffect( () => {
		fetchData(`${apiRoot.url}/${params.clientID}/analysis/${props.questionID}/`)
		// eslint-disable-next-line
	}, []);

	const data = new Array(5)
	recievedData.forEach(obj => data[obj.score - 1] = obj.number_of_votes);
	
return (
	<div className="bar-chart">
		<Bar className='bar'
		data={{
			// Name of the variables on x-axies for each bar
			labels: ["1", "2", "3", "4", "5"],
			datasets: [
			{
				// Label for bars
				label: "number of people vote",
				// Data or value of your each variable
				data: data,
				// Color of each bar
				backgroundColor: ["crimson", "tomato", "rgb(250, 250, 81)", "skyblue", "aqua"],
			},
			],
		}}
		// Height of graph
		//height={400}
		options={{
			maintainAspectRatio: false
		}}
		/>
	</div>
);
}

export default BarChart;
