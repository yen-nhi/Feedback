import { useRef } from 'react';
import './OptionalQuestion.css';


const OptionalQuestion = (props) => {
    const enteredAnswer = useRef();

    const inputHandler = () => {
        props.onInput(enteredAnswer.current.value);
    };

    return(
        <div className="mb-3 optional-question">
            <textarea 
                className="form-control" 
                rows="3" 
                placeholder='How can we do it better? (Optional)'
                ref={enteredAnswer}
                onBlur={inputHandler}
                >            
            </textarea>
        </div>
    )
};

export default OptionalQuestion;