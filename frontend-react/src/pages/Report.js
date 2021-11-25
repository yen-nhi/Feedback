import React, {useEffect, useContext} from 'react';
import BarChart from '../components/BarChart';
import './Report.css';
import useFetch from '../hooks/use-fetch';
import { useParams } from 'react-router-dom';
import EndpointContext from '../store/api-endpoint';
import LoadingSpinner from '../UI/LoadingSpinner';

const Report = (props) => {
    const params = useParams();
    const { isLoading, hasError, recievedData, fetchData } = useFetch();
    const apiRoot = useContext(EndpointContext);
    
    useEffect( () => {
        fetchData(`${apiRoot.url}/${params.clientID}/surveys/${params.surveyID}`, 'GET', null);
        // eslint-disable-next-line
    }, []);

    const chart = recievedData.map((question, i) => 
        <li key={question.id}>
            <h5>{`Question ${i+1}. ${question.question}`}</h5>
            <div>
                <p>Total votes for each score level</p>
                <BarChart questionID={question.id}/>
            </div>
        </li>);

    return(
        <ul className='report'>
            {isLoading && <LoadingSpinner/>}
            {hasError && <p>Something went wrong!</p>}
            {chart}
        </ul>
        
    )
};

export default Report;