import React, { useRef } from 'react';
import './NewSurvey.css';
import NewQuestion from '../components/NewQuestion';
import { useState, useEffect, useContext } from 'react';
import useFetch from '../hooks/use-fetch';
import EndpointContext from '../store/api-endpoint';
import Modal from '../UI/Modal';
import DraftWarning from '../components/DraftWarning';
import { useLocation } from 'react-router-dom';


const NewSurvey = () => {
    const title = useRef('');
    const [invalidTitle, setInvalidTitle] = useState(null);
    const [showDrafts, setShowDrafts] = useState(false);
    const [isDraft, setIsDraft] = useState(null);
    const [drafts, setDrafts] = useState([]);
    const [inputs, setInputs] = useState([]);
    const apiRoot = useContext(EndpointContext);
    const location = useLocation();
    const { isLoading, hasError, fetchData } = useFetch();
    
    const header = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
    }

    //When user click 'Open drafts' button, the list of user's drafts will be shown
    const draftsHandler = () => {
        setShowDrafts(true);
        fetch(`${apiRoot.url}/drafts`, {
            headers: header
        })
        .then(res => res.json().then(data => {
            const draftsList = data.data.map(item => <li key={item.id} onClick={() => openDraftHandler(item.id, item.name)}>{item.name}</li>);
            setDrafts(draftsList);   
        }));
    };

    //The user select a draft survey from the list above, then the draft will be open 
    // as new survey form with inital questions got fro the draft
    const openDraftHandler = (id, name) => {
        setShowDrafts(false);
        title.current.value = name;
        fetch(`${apiRoot.url}/surveys/${id}/questions`, {headers: header})
        .then(res => res.json()).then(data => {
            setInputs(data.data.map(item => item.question));
        })
    };

    //Close modal
    const closeDraftsModal = () => {
        setShowDrafts(false);
    };

    //To change inputs
    const changeQuestionHandler = (index, value) => {
            const newInputs = [...inputs];
            newInputs[index] = value;
            setInputs(newInputs);
    };

    const deleteQuestionHandler = (index) => {
        const newInputs = [...inputs];
        newInputs.splice(index, 1);
        setInputs(newInputs);
    };

    const addQuestionHandler = () => {
        setInputs(prev => [...prev, '']);
    };

    useEffect( () => {
        if (location.state !== null) {
            const { draft, name } = location.state;
            openDraftHandler(draft, name);
        } else {
            setInputs(['', '', '']);
        }
    }, []);
 
    const questions = inputs.map((value, i) => <NewQuestion 
        key={i} 
        index={i}
        value={value} 
        recordQuestion={changeQuestionHandler}
        onDelete={deleteQuestionHandler}
        />);

    //Build object to send to POST request
    const object = () => {
        return{
        title: title.current.value,
        questions: inputs,
    }};

    //User can save the draft as new draft or replace the exiting draft
    const saveDraftHandler = () => {
        const draft_name = title.current.value.trim();
        if (draft_name === '') {
            setInvalidTitle('*Title cannot be empty')
            return;
        }
        fetch(`${apiRoot.url}/surveys?title=${draft_name}`, {headers: header})
        .then(res => res.json()).then(data => {
            if (data.message === 'NOT EXIST') {
                setInvalidTitle(null);
                fetch(`${apiRoot.url}/drafts`, {
                    method: 'POST',
                    headers: header,
                    body: JSON.stringify(object())
                })
            } else {
                setInvalidTitle('*Existed title');
                setIsDraft(data.message);
            }
        });
    };

    const submitHandler = (event) => {
        event.preventDefault();
        fetch(`${apiRoot.url}/surveys?title=${title.current.value.trim()}`, {headers: header})
        .then(res => res.json()).then(data => {
            if (data.message === 'NOT EXIST') {
                fetchData(`${apiRoot.url}/surveys`, 'POST', null, object());
                setInvalidTitle(false);
                setInputs(['', '', '']);
                title.current.value = '';        
            } else {
                setInvalidTitle(true);
            }
        });
        };

    return(
        <div className="new-survey-page">
            {showDrafts && 
                <Modal onClose={closeDraftsModal}>
                    <ul className="drafts">{drafts}</ul>
                </Modal>
            }
            {isDraft !== null && <DraftWarning 
                onClose={() => setIsDraft(null)} 
                id={isDraft}
                object={object}/>}
            <div className='survey-header-control'>
                <button type='button' className='add-question-btn' onClick={draftsHandler}>Open drafts</button>
                <button type='button' className='add-question-btn' onClick={saveDraftHandler}>Save as drafts</button>
            </div>
            <form className='new-survey-form' onSubmit={submitHandler}>
                <div className="mb-3">
                    <input className="form-control" type="text" placeholder="Survey's title" ref={title} required/>
                    {invalidTitle !== null && <small className='warning'>{invalidTitle}</small>}
                </div>
                <p>Questions</p>
                <small>* Please be notice that every question is answered by giving score from 1 to 5. Make sure they are score-questions.</small>
                <br/><br/>
                {questions}
                <button type='button' className='add-question-btn' onClick={addQuestionHandler}>+ Add question</button>
                {hasError && <p className='warning'>Save survey failed!</p>}
                <button type='submit' disabled={isLoading? true : false} className='save-new-survey'>Save</button>
            </form>
        </div>
    );
};

export default NewSurvey;