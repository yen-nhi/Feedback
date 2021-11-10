import './NewQuestion.css';
import deleteIcon from '../media/close.png';

const NewQuestion = (props) => {

    const onChangeHandler = (event) => {   
        props.recordQuestion(props.index, event.target.value)
    };

    const deleteHandler = () => {
        props.onDelete(props.index);
    };

    return(
        <div className='new-question'>
            <div className="input-group mb-3">
                <span className="input-group-text">{props.index + 1}</span>
                <input type="text" className="form-control" required value={props.value} onChange={onChangeHandler}/>
                <span className="input-group-text delete-question" onClick={deleteHandler}><img src={deleteIcon} alt='delete' width='20'/></span>
            </div>
        </div>    
    );
};

export default NewQuestion;