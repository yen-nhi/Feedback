import Score from "./Score";
import classes from './Question.module.css';
import OptionalQuestion from "./OptionalQuestion";
import { useContext, useState } from "react";
import useFetch from "../../hooks/use-fetch";
import {SurveyorContext} from "../../store/survey-context";
import EndpointContext from '../../store/api-endpoint';
import React from "react";

    const Question = (props) => {
        const apiRoot = useContext(EndpointContext);
        const [showOptinalQuestion, setShowOptionalQuestion] = useState(false);
        const [answerID, setAnswerID] = useState(null)
        const { hasError, fetchData } = useFetch();

        const surveyorCtx = useContext(SurveyorContext);

        const header = {
            'Content-Type': 'application/json',
        }

        const onScoreHandler = (score) => {
            if ( score > 0 && score < 3 ) {
                setShowOptionalQuestion(true);
            } else {
                setShowOptionalQuestion(false);
            }

            // If not created surveyor
            if (!surveyorCtx.surveyorID) {
                //fetchData('${apiRoot.url}/create-surveyor', 'POST', {survey_id: props.surveyID})
                fetch(`${apiRoot.url}/surveyors`, {
                method: 'POST',
                headers: header,
                body: JSON.stringify({
                    survey_id: props.surveyID
                })
                }).then(res => res.json())
                .then(data1 => {
                    surveyorCtx.updateSurveyorID(data1.data);

                    const object = {
                        survey_id: props.surveyID,
                        question_id: props.question.id,
                        score: score,
                        surveyor_id: data1.data
                    };
                    fetch(`${apiRoot.url}/answers`, {
                    method: 'POST',
                    headers: header,
                    body: JSON.stringify(object)
                    }).then(res => res.json()).then(data2 => {
                        setAnswerID(data2.data);
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
                    fetch(`${apiRoot.url}/answers`, {
                    method: 'POST',
                    headers: header,
                    body: JSON.stringify(object)
                    }).then(res => res.json()).then(data => {
                        setAnswerID(data.data);
                    });
                } 
                //If answerID is already exist, send PUT method to edit the existing row
                else {
                    const object = {
                        answer_id: answerID,
                        score: score,
                    };
                    fetchData(`${apiRoot.url}/answers`, 'PUT', header, object);  
                }
            }
        };


        const updateAnwser = (inputAnwser) => {
            const object = {
                answer_id: answerID,
                optional_answer: inputAnwser,
            };
            fetchData(`${apiRoot.url}/answers`, 'PUT', header, object);  
        };

        return(
            <React.Fragment>
            <li className={classes.question}>
                <div className={classes.questionLeft}>
                    <p>{props.question.question}</p>
                </div>
                <div className={classes.questionRight}>
                    <Score onScore={onScoreHandler}/>
                </div>
                {showOptinalQuestion && <OptionalQuestion onInput={updateAnwser}/>}
                {hasError && <p>Sent answer failed!</p>}
            </li>
            <hr/>
            </React.Fragment>
        )
    };

export default Question;