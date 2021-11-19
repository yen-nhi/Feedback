import './ClientSurvey.css';
import useFetch from '../hooks/use-fetch';
import { useEffect, useState, useContext } from 'react';
import Button from '../UI/Button';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import backIcon from '../media/back.png';
import LoadingSpinner from '../UI/LoadingSpinner';
import SurveyLink from './SurveyLink';
import React from 'react';
import DeletionConfirm from './DeletionConfirm';
import ChartBar from './ChartBar';
import EndpointContext from '../store/api-endpoint';


const ClientSurvey = (props) => {
    const apiRoot = useContext(EndpointContext);
    const { isLoading, hasError, recievedData, fetchData } = useFetch();
    const params = useParams();
    const location = useLocation();
    const history = useHistory();
    const { title } = location.state;
    const [ showlink, setShowLink ] = useState(false);
    const [ showDeletionConfirm, setShowDeletionConfirm ] = useState(false);

    const showlinkHandler = () => {
        setShowLink(true);
    };
    const closelinkHandler = () => {
        setShowLink(false);
    };

    const showDeletionConfirmHandler = () => {
        setShowDeletionConfirm(true);
    }
    const closeDeletion = () => {
        setShowDeletionConfirm(false);
    }


    useEffect( () => {
        fetchData(`${apiRoot.url}/${params.clientID}/surveys/${params.surveyID}`, 'GET', null);
        // eslint-disable-next-line
    }, []);

    const returnHandler = () => {
        history.push(`/account/${params.clientID}`);
    };

    const questions = recievedData.map((item, i) => 
        <li key={item.id}>{i+1}. {item.question} <ChartBar questionID={item.id}/></li>);

    return(
        <React.Fragment>
            {showlink && <SurveyLink surveyID={params.surveyID} onClose={closelinkHandler}/>}
            {showDeletionConfirm && <DeletionConfirm title={title} surveyID={params.surveyID} onClose={closeDeletion}/>}
            <div className='survey-details-page'>
                <div className='survey-details'>
                    <div className='survey-header'>
                        <h4>{title}</h4>
                        <div className='icons'>
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
                    <div className='inactive-btn'>
                        <Button onClick={showlinkHandler}>Get link</Button>
                        <Button onClick={showDeletionConfirmHandler}>Delete</Button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
};

export default ClientSurvey;