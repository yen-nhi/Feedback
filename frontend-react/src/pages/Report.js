import React, {useEffect, useContext} from 'react';
import ColumnChart from '../components/charts/ColumnChart';
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
        fetchData(`${apiRoot.url}/bi/answers?filter=avg_score&survey_id=${params.surveyID}`, 'GET', null, null);
        // eslint-disable-next-line
    }, []);

    const questions = recievedData.map((question, i) => {return {num: i+1, id: question.id, question: question.question}});
    

    return(
        <div className='report'>
            <div className='report-header-control'>
                <ButtonOutline>Details</ButtonOutline>
                <ButtonOutline>Overall</ButtonOutline>
                <ButtonOutline>Period</ButtonOutline>
            </div>
            <div className='report-session'>
                {isLoading && <LoadingSpinner/>}
                {hasError && <p>Something went wrong!</p>}
                <ColumnChart questions={questions} surveyID={params.surveyID}/>
            </div>
        </div>
        
    )
};

export default Report;