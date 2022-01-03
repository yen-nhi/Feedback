import React, {useEffect, useContext, useState} from 'react';
import ColumnChart from '../components/charts/ColumnChart';
import classes from './Report.module.css';
import useFetch from '../hooks/use-fetch';
import { useParams } from 'react-router-dom';
import EndpointContext from '../store/api-endpoint';
import LoadingSpinner from '../UI/LoadingSpinner';
import ButtonOutline from '../UI/ButtonOutline';
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
        <div className={classes.report}>
            <div className={classes.reportHeaderControl}>
                <ButtonOutline className={isOverall && classes.chartActive} onClick={onOverall}>Overall</ButtonOutline>
                <ButtonOutline className={isDetails && classes.chartActive} onClick={onDetails}>Details</ButtonOutline>
                <ButtonOutline onClick={onPeriod}>Period</ButtonOutline>
                {showDatePicker && 
                    <span>
                        <select className={classes.periodSelect}>
                            <option value="1">1 month</option>
                            <option value="2">3 months</option>
                            <option value="3">6 months</option>
                            <option value="4">1 year</option>
                            <option defaultValue="5">Max</option>
                        </select>
                    </span>
                }
            </div>
            <div className={classes.reportSession}>
                {isLoading && <LoadingSpinner/>}
                {hasError && <p>Something went wrong!</p>}
                {isOverall && <ColumnChart questions={questions} surveyID={params.surveyID}/>}
                {isDetails && <LineChart/>}
            </div>
        </div>
        
    )
};

export default Report;