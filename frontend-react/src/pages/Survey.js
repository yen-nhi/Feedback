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
        fetchData(`${apiRoot.url}/survey${surveyID}/questions`, 'GET', null);
        // eslint-disable-next-line
    }, []);

    const listQuestions = recievedData.map((quest) => 
        <Question 
            key={quest.id} 
            question={quest} 
            surveyID={surveyID}
        />);


    return (
        <SurveyorContextProvider>
            <div className='survey-page'>
                <div className='survey-content'>
                    {isLoading && <LoadingSpinner />}
                    {hasError && <p className='error'>{hasError}</p>}
                    <ul>
                        {listQuestions}
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