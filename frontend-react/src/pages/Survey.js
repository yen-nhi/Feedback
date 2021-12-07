import { useEffect, useContext } from 'react';
import './Survey.css';
import Question from '../components/Question';
import LoadingSpinner from '../UI/LoadingSpinner';
import Button from '../UI/Button';
import { useParams, Link } from 'react-router-dom';
import useFetch from '../hooks/use-fetch';
import SurveyorContextProvider from '../store/survey-context';
import EndpointContext from '../store/api-endpoint';


const Survey = () => {
    const params = useParams();
    const surveyID = params.surveyID;
    const apiRoot = useContext(EndpointContext);

    const { isLoading, hasError, recievedData, fetchData } = useFetch();
    
    
    useEffect ( () => {
        const header = {
            'Content-Type': 'application/json',
        }
        fetchData(`${apiRoot.url}/${surveyID}/questions`, 'GET', header, null);
        // eslint-disable-next-line
    }, []);


    return (
        <SurveyorContextProvider>
            <div className='survey-page'>
                <div className='survey-content'>
                    {isLoading && <LoadingSpinner />}
                    {hasError && <p className='error'>{hasError}</p>}
                    <h4>{recievedData[0] ? recievedData[0].name : ''}</h4>
                    <ul>
                    {recievedData.map((quest) => 
                            <Question 
                                key={quest.id} 
                                question={quest} 
                                surveyID={surveyID}
                            />)}
                    </ul>
                    <div className='submit-survey'>
                        <Link to='/thankyou'><Button>Finish</Button></Link>
                    </div>
                </div>
            </div>
        </SurveyorContextProvider>
    )
};

export default Survey;