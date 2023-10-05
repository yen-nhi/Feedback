import React, { useRef, useState, useEffect, useContext } from 'react';
import classes from './NewSurvey.module.css';
import NewQuestion from '../components/surveys/NewQuestion';
import DraftWarning from '../components/surveys/DraftWarning';
import EndpointContext from '../store/api-endpoint';
import Modal from '../UI/Modal';
import ButtonOutline from '../UI/ButtonOutline';
import { useLocation, useHistory } from 'react-router-dom';


const NewSurvey = () => {
    const title = useRef('');
    const [invalidTitle, setInvalidTitle] = useState(null);
    const [showDrafts, setShowDrafts] = useState(false);
    const [isExist, setIsExist] = useState(false);
    const [drafts, setDrafts] = useState([]);
    const [draftId, setDraftId] = useState(null); 
    const [inputs, setInputs] = useState([]);
    const [savingNewSurvey, setSavingNewSurvey] = useState(false);
    const [hasError, setHasError] = useState(false);
    const apiRoot = useContext(EndpointContext);
    const location = useLocation();
    const history = useHistory();

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
        setDraftId(id);
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
        if (location.state !== null && location.state !== undefined) {
            console.log('location.state', location.state);
            const { draft, name } = location.state;
            openDraftHandler(draft, name);
            setDraftId(draft);
        } else {
            setInputs(['', '', '']);
        }
        // eslint-disable-next-line
    }, []);
 
    const questions = inputs.map((value, i) => <NewQuestion 
        key={i} 
        index={i}
        value={value} 
        recordQuestion={changeQuestionHandler}
        onDelete={deleteQuestionHandler}
        />);

    const resetForm = () => {
        setHasError(false);
        setDraftId(null);
        setInvalidTitle(null);
        setInputs(['', '', '']);
        title.current.value = '';             
    };

    const postSurvey = (url) => {
        const surveyName = title.current.value.trim();
        if (surveyName === '') {
            setInvalidTitle('*Title cannot be empty')
            return;
        }
        fetch(url, {
            method: 'POST',
            headers: header,
            body: JSON.stringify({
                title: surveyName,
                questions: inputs
            })
        }).then(res => res.json()).then(data => {
            console.log(data)
                if (data.status === 'OK') {
                    setInvalidTitle(null);
                    setIsExist(false);
                    if (savingNewSurvey) {
                        resetForm();
                        setSavingNewSurvey(false);
                    } else {
                        setDraftId(data.data)
                    }
                } else {
                    setInvalidTitle('*Existed title');
                    setIsExist(true);    
                }
            }).catch(err => setHasError(true));
    };


    //User can save the draft as new draft or replace the exiting draft
    const saveDraftHandler = () => {
        postSurvey(`${apiRoot.url}/drafts`);

    };

    const exitHandler = () => {history.push('/account')};

    const submitHandler = (event) => {
        event.preventDefault();
        setSavingNewSurvey(true);
        if (draftId === null) {
            postSurvey(`${apiRoot.url}/surveys`);             
        } else {
            // update draft to survey
            fetch(`${apiRoot.url}/surveys/${draftId}`, {
                method: 'PUT',
                headers: header,
                body: JSON.stringify({
                    title: title.current.value.trim(),
                    questions: inputs  
                })
            }).then(res => res.json()).then(result => {
                if (result.status === 'OK'){
                    resetForm();
                    setSavingNewSurvey(false);
                }
            })
            .catch(err => console.log(err))
        }
    };

    return(
        <div className={classes.newSurveyPage}>
            {showDrafts && 
                <Modal onClose={closeDraftsModal}>
                    {drafts.length === 0 && <p>You have no draft saved.</p>}
                    <ul className={classes.drafts}>{drafts}</ul>
                </Modal>
            }
            {isExist && <DraftWarning 
                onClose={() => setIsExist(null)} 
                doneReplace={() => setInvalidTitle(null)}
                id={draftId}
                object={{title: title.current.value.trim(), questions: inputs}}/>}
            <div className={classes.surveyHeaderControl}>
                <ButtonOutline type='button' onClick={draftsHandler}>Open drafts</ButtonOutline>
                <ButtonOutline type='button' onClick={saveDraftHandler}>Save as drafts</ButtonOutline>
                <ButtonOutline type='button' onClick={resetForm}>New survey</ButtonOutline>
                <ButtonOutline type='button' onClick={exitHandler}>Exit</ButtonOutline>
            </div>
            <form className={classes.newSurveyForm} onSubmit={submitHandler}>
                <div className="mb-3">
                    <input className="form-input" type="text" placeholder="Survey's title" ref={title} required/>
                    {invalidTitle !== null && <small className={classes.warning}>{invalidTitle}</small>}
                </div>
                <p>Questions</p>
                <small>* Please be notice that every question is answered by giving score from 1 to 5. Make sure they are score-questions.</small>
                <br/><br/>
                <ul className={classes.NewQuestionList}>{questions}</ul>
                <ButtonOutline type='button'onClick={addQuestionHandler}>Add question</ButtonOutline>
                {hasError && <p className={classes.warning}>Save survey failed!</p>}
                <button type='submit' className={classes.saveNewSurvey}>Save</button>
            </form>
        </div>
    );
};

export default NewSurvey;