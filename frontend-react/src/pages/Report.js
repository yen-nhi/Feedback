import React, {useEffect, useContext, useState} from 'react';
import ColumnChart from '../components/charts/ColumnChart';
import './Report.css';
import useFetch from '../hooks/use-fetch';
import { useParams } from 'react-router-dom';
import EndpointContext from '../store/api-endpoint';
import LoadingSpinner from '../UI/LoadingSpinner';
import ButtonOutline from '../UI/ButtonOutline';
import DatePicker from '../UI/DatePicker';
import LineChart from '../components/charts/LineChart';

const Report = (props) => {
    const params = useParams();
    const { isLoading, hasError, recievedData, fetchData } = useFetch();
    const apiRoot = useContext(EndpointContext);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isDetails, setIsDetails] = useState(false);
    const [isOverall, setIsOverall] = useState(true);


    useEffect( () => {
        fetchData(`${apiRoot.url}/bi/answers?filter=avg_score&survey_id=${params.surveyID}`, 'GET', null, null);
        // eslint-disable-next-line
    }, []);

    const questions = recievedData.map((question, i) => {return {num: i+1, id: question.id, question: question.question}});
    
    const onOverall = () => {
        setIsOverall(true);
        setIsDetails(false)
        setShowDatePicker(false);
    };    
    const onDetails = () => {
        setIsDetails(true);
        setIsOverall(false)
        setShowDatePicker(false);
    };
    const onPeriod = () => {
        setShowDatePicker(true);
    };

    return(
        <div className='report'>
            <div className='report-header-control'>
                <ButtonOutline className={isOverall && 'active'} onClick={onOverall}>Overall</ButtonOutline>
                <ButtonOutline className={isDetails && 'active'} onClick={onDetails}>Details</ButtonOutline>
                <ButtonOutline onClick={onPeriod}>Period</ButtonOutline>
                {showDatePicker && 
                    <span>
                        <span><DatePicker /></span>
                        <span><DatePicker /></span>
                    </span>
                }
            </div>
            <div className='report-session'>
                {isLoading && <LoadingSpinner/>}
                {hasError && <p>Something went wrong!</p>}
                {isOverall && <ColumnChart questions={questions} surveyID={params.surveyID}/>}
                {isDetails && <LineChart/>}
            </div>
        </div>
        
    )
};

export default Report;