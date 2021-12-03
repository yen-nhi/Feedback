import './ChartBar.css';
import useFetch from '../hooks/use-fetch';
import { useParams } from 'react-router-dom';
import { useEffect, useContext, useState } from 'react';
import EndpointContext from '../store/api-endpoint';


const ChartBar = (props) => {
    const apiRoot = useContext(EndpointContext);
    const params = useParams();
    const { isLoading, hasError, recievedData, fetchData } = useFetch();

    useEffect( () => {
        fetchData(`${apiRoot.url}/questions/${props.questionID}?filter=avgscore`, 'GET', null, null)
        // eslint-disable-next-line
    }, []);

    const avgScore = (recievedData[0] ? parseFloat(recievedData[0]).toFixed(1) : 0);
    const percent = (recievedData[0] ? ((recievedData[0]/5)*100 + '%') : 0);

    return(
        <div className='chart-bar'>
            <div className='filling' style={{width: percent}}><span>{avgScore}</span></div>
        </div>
    )
};

export default ChartBar;