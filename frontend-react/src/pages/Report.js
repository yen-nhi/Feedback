import React, {useEffect, useContext} from 'react';
import BarChart from '../components/BarChart';
import './Report.css';
import useFetch from '../hooks/use-fetch';
import { useParams } from 'react-router-dom';
import EndpointContext from '../store/api-endpoint';
import LoadingSpinner from '../UI/LoadingSpinner';
import ButtonOutline from '../UI/ButtonOutline';

const Report = (props) => {
    const params = useParams();
    const { isLoading, hasError, recievedData, fetchData } = useFetch();
    const apiRoot = useContext(EndpointContext);

    useEffect( () => {
        fetchData(`${apiRoot.url}/bi/answers?survey_id=${params.surveyID}`, 'GET', null, null);
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
        <div className='report'>
            <div className='report-header-control'>
                <ButtonOutline>Details</ButtonOutline>
                <ButtonOutline>Overall</ButtonOutline>
                <ButtonOutline>Period</ButtonOutline>
            </div>
            <div className='report-session'>
                <ul>
                    {isLoading && <LoadingSpinner/>}
                    {hasError && <p>Something went wrong!</p>}
                    {chart}
                </ul>
            </div>
        </div>
        
    )
};

export default Report;