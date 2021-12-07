import React, { useEffect, useContext } from "react";
import './BarChart.css';
import useFetch from "../hooks/use-fetch";
import EndpointContext from '../store/api-endpoint';

const BarChart = (props) => {
	const { isLoading, hasError, recievedData, fetchData } = useFetch();
	const apiRoot = useContext(EndpointContext);


	useEffect( () => {
		fetchData(`${apiRoot.url}/bi/answers?question_id=${props.questionID}`, 'GET', null, null)
		// eslint-disable-next-line
	}, []);

	console.log(recievedData);
	const chartdata = new Array([0, 0, 0, 0, 0]);
	recievedData.forEach(obj => chartdata[obj.score - 1] = obj.number_of_votes);
	
	return <p>Charts</p>;
}

export default BarChart;
