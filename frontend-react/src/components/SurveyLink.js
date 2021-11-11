import Modal from "../UI/Modal";
import './SurveyLink.css';
import copyIcon from '../media/copy1.png';
import { useState } from "react";

const SurveyLink = (props) => {    
    var link = `http://localhost:3000/surveys/${props.surveyID}`;
    
    const copyLinkHandler = () => {
        const tempInput = document.createElement('input')
        tempInput.value = link; 
        document.body.appendChild(tempInput)
        tempInput.select()
        document.execCommand('copy')
        document.body.removeChild(tempInput)
    }

    
    return(
        <Modal onClose={props.onClose}>
            <div>
                <p>Copy this link and send to your customers.</p>
                <p className='survey-link'>
                    <span id='survey-url'>{link}</span>
                    <span className='copy' onClick={copyLinkHandler}>
                        <img src={copyIcon} alt='Copy' width='25'/>
                    </span>
                </p>
            </div>
        </Modal>
    )
};

export default SurveyLink;