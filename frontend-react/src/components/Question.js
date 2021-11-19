import Score from "./Score";
import './Question.css';
import OptionalQuestion from "./OptionalQuestion";
import { useContext, useState } from "react";
import useFetch from "../hooks/use-fetch";
import {SurveyorContext} from "../store/survey-context";
import EndpointContext from '../store/api-endpoint';

    const Question = (props) => {
        const apiRoot = useContext(EndpointContext);
        const [showOptinalQuestion, setShowOptionalQuestion] = useState(false);
        const [answerID, setAnswerID] = useState(null)
        const { hasError, fetchData } = useFetch();

        const surveyorCtx = useContext(SurveyorContext);

        const onScoreHandler = (score) => {
            if ( score > 0 && score < 3 ) {
                setShowOptionalQuestion(true);
            } else {
                setShowOptionalQuestion(false);
            }

            // If not created surveyor
            if (!surveyorCtx.surveyorID) {
                //fetchData('${apiRoot.url}/create-surveyor', 'POST', {survey_id: props.surveyID})
                fetch(`${apiRoot.url}/new-surveyor`, {
                method: 'POST',
                body: JSON.stringify({
                    survey_id: props.surveyID
                })
                }).then(res => res.json())
                .then(data1 => {
                    console.log('last surveyor', data1);
                    surveyorCtx.updateSurveyorID(data1);

                    const object = {
                        survey_id: props.surveyID,
                        question_id: props.question.id,
                        score: score,
                        surveyor_id: data1
                    };
                    fetch(`${apiRoot.url}/answer`, {
                    method: 'POST',
                    body: JSON.stringify(object)
                    }).then(res => res.json()).then(data2 => {
                        console.log('no surveyor last answer', data2);
                        setAnswerID(data2);
                    });
                });
            } else {

            // If answerID is not exist, send POST method to create new row in database
                if(!answerID) {
                    const object = {
                        survey_id: props.surveyID,
                        question_id: props.question.id,
                        score: score,
                        surveyor_id: surveyorCtx.surveyorID
                    };
                    // fetchData('${apiRoot.url}/send-answer', 'POST', object);
                    // setAnswerID(recievedData);
                    fetch(`${apiRoot.url}/answer`, {
                    method: 'POST',
                    body: JSON.stringify(object)
                    }).then(res => res.json()).then(data => {
                        console.log('with surveyor last answer', data);
                        setAnswerID(data);
                    });
                } 
                //If answerID is already exist, send PUT method to edit the existing row
                else {
                    const object = {
                        answer_id: answerID,
                        score: score,
                    };
                    fetchData(`${apiRoot.url}/answer`, 'PUT', object);  
                }
            }
        };


        const updateAnwser = (inputAnwser) => {
            const object = {
                answer_id: answerID,
                optional_answer: inputAnwser,
            };
            fetchData(`${apiRoot.url}/send-answer`, 'PUT', object);  
        };

        return(
            <li className='question'>
                <div className='question-left'>
                    <h5>{props.question.question}</h5>
                </div>
                <div className='question-right'>
                    <Score onScore={onScoreHandler}/>
                </div>
                {showOptinalQuestion && <OptionalQuestion onInput={updateAnwser}/>}
                {hasError && <p>Sent answer failed!</p>}
            </li>
        )
    };

export default Question;