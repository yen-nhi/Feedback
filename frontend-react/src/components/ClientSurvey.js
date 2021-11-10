import './ClientSurvey.css';
import useFetch from '../hooks/use-fetch';
import { useEffect } from 'react';
import Button from '../UI/Button';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import backIcon from '../media/back.png';
import LoadingSpinner from '../UI/LoadingSpinner';

const ClientSurvey = (props) => {
    const { isLoading, hasError, recievedData, fetchData } = useFetch();
    const params = useParams();
    const location = useLocation();
    const history = useHistory();
    const { title } = location.state;

    useEffect( () => {
        fetchData(`http://127.0.0.1:5000/${params.clientID}/surveys/${params.surveyID}`, 'GET', null);
    }, []);

    const returnHandler = () => {
        history.push(`/account/${params.clientID}`);
    };

    const questions = recievedData.map((item, i) => <li key={item.id}>{i+1}. {item.question}</li>);

    return(
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
                    <Button>Inactive</Button>
                    <Button>Delete</Button>
                </div>
            </div>
        </div>
    )
};

export default ClientSurvey;