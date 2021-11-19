import { useRef } from 'react';
import './NewSurvey.css';
import NewQuestion from '../components/NewQuestion';
import { useState, useEffect, useContext } from 'react';
import useFetch from '../hooks/use-fetch';
import EndpointContext from '../store/api-endpoint';


const NewSurvey = () => {
    
    const title = useRef('');
    const [inputs, setInputs] = useState([]);
    const apiRoot = useContext(EndpointContext);
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
        addQuestionHandler();
        addQuestionHandler();
        addQuestionHandler();
    }, []);

  
    const questions = inputs.map((value, i) => <NewQuestion 
        key={i} 
        index={i}
        value={value} 
        recordQuestion={changeQuestionHandler}
        onDelete={deleteQuestionHandler}
        />);


    const { isLoading, hasError, recievedData, fetchData } = useFetch();
    const submitHandler = (event) => {
        event.preventDefault();
        const obj = {
            id: localStorage.getItem('id'), 
            title: title.current.value,
            questions: inputs
        }
        fetchData(`${apiRoot.url}/new-survey`, 'POST', obj);
        console.log(recievedData);
        setInputs(['']);
        title.current.value = '';
        };

    return(
        <form className='new-survey-form' onSubmit={submitHandler}>
            <div className="mb-3">
                <input className="form-control" type="text" placeholder="Survey's title" ref={title} required/>
            </div>
            <p>Questions</p>
            <small>* Please be notice that every question is answered by giving score from 1 to 5. Make sure they are score-questions.</small>
            <br/><br/>
            {questions}
            <button type='button' className='add-question-btn' onClick={addQuestionHandler}>+ Add question</button>
            {hasError && <p className='warning'>Save survey failed!</p>}
            <button type='submit' disabled={isLoading? true : false} className='save-new-survey'>Save</button>
        </form>
    );
};

export default NewSurvey;