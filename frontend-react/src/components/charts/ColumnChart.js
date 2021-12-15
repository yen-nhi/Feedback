import React, { useEffect, useContext } from "react";
import './ColumnChart.css';
import EndpointContext from '../../store/api-endpoint';
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';	
import useFetch from "../../hooks/use-fetch";
import LoadingSpinner from "../../UI/LoadingSpinner";

const ColumnChart = (props) => {
	const apiRoot = useContext(EndpointContext);
	// const [dataset, setDataset] = useState([]);
	const {isLoading, hasError, recievedData, fetchData} = useFetch();

	useEffect( () => {
		fetchData(`${apiRoot.url}/bi/answers?filter=analysis&survey_id=${props.surveyID}`, 'GET', null, null)
		// eslint-disable-next-line
	}, []);

	const options = {
		responsive: true,
		plugins: {
		  legend: {
			position: 'top',
		  },
		  title: {
			display: true,
			text: 'Chart.js Bar Chart',
		  },
		},
	  };
	  
	const labels = props.questions.map(item => `${item.num}. ${item.question}`);
	
	const data = {
		labels,
		datasets: [
		  {
			label: '1',
			data: recievedData[0],
			backgroundColor: 'rgba(255, 99, 132, 0.5)',
		  },
		  {
			label: '2',
			data: recievedData[1],
			backgroundColor: 'rgba(53, 162, 235, 0.5)',
		  },		  {
			label: '3',
			data: recievedData[2],
			backgroundColor: 'rgba(1, 224, 113, 0.5)',
		  },
		  {
			label: '4',
			data: recievedData[3],
			backgroundColor: 'rgba(251, 210, 26, 0.5)',
		  },
		  {
			label: '5',
			data: recievedData[4],
			backgroundColor: 'rgba(115, 250, 52, 0.5)',
		  },

		],
	  };

	return (
	<React.Fragment>
		{isLoading && <LoadingSpinner/>}
		{hasError && <p>Something went wrong!</p>}
		<Bar options={options} data={data} />
	</React.Fragment>
	);
}

export default ColumnChart;
