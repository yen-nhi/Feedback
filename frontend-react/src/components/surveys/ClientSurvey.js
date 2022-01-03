import classes from './ClientSurvey.module.css';
import useFetch from '../../hooks/use-fetch';
import React, { useEffect, useState, useContext } from 'react';
import Button from '../../UI/Button';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import backIcon from '../../media/back.png';
import LoadingSpinner from '../../UI/LoadingSpinner';
import SurveyLink from './SurveyLink';
import DeletionConfirm from './DeletionConfirm';
import ChartBar from '../charts/ChartBar';
import EndpointContext from '../../store/api-endpoint';


const ClientSurvey = () => {

    const apiRoot = useContext(EndpointContext);
    const { isLoading, hasError, recievedData, fetchData } = useFetch();
    const params = useParams();
    const location = useLocation();
    const history = useHistory();
    const { title } = location.state;
    const [ showlink, setShowLink ] = useState(false);
    const [ showDeletionConfirm, setShowDeletionConfirm ] = useState(false);

    useEffect( () => {
        fetchData(`${apiRoot.url}/bi/answers?filter=avg_score&survey_id=${params.surveyID}`, 'GET', null, null);
        // eslint-disable-next-line
    }, []);

    const questions =  recievedData.map((item, i) => 
        <li key={item.id}>{i+1}. {item.question} <ChartBar questionID={item.id} avgScore={item.avg_score}/></li>);  

    const returnHandler = () => {
        history.push(`/account`);
    };

    const showLinkHandler = () => {setShowLink(true)};
    const showDeletionConfirmHandler = () => {setShowDeletionConfirm(true)};

    return(
        <React.Fragment>
            {showlink && <SurveyLink surveyID={params.surveyID} onClose={() => setShowLink(false)}/>}
            {showDeletionConfirm && <DeletionConfirm title={title} surveyID={params.surveyID} onClose={() => setShowDeletionConfirm(false)}/>}
            <div className={classes.surveyDetailsPage}>
                <div className={classes.surveyDetails}>
                    <div className={classes.surveyHeader }>
                        <h4>{title}</h4>
                        <div className={classes.icons}>
                            <img src={backIcon} alt='back' width='20' onClick={returnHandler}/>
                        </div>
                    </div>
                    <hr/>
                    {isLoading && <LoadingSpinner />}
                    {hasError && <p>Something went wrong!</p>}
                    <ul>
                        {questions}
                    </ul>
                    <hr/>
                    <div className={classes.inactiveBtn}>
                        <Button onClick={showLinkHandler}>Get link</Button>
                        <Button onClick={showDeletionConfirmHandler}>Delete</Button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
};

export default ClientSurvey;