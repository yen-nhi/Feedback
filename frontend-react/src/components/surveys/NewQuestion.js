import classes from './NewQuestion.module.css';
import deleteIcon from '../../media/close.png';

const NewQuestion = (props) => {

    const onChangeHandler = (event) => {   
        props.recordQuestion(props.index, event.target.value)
    };

    const deleteHandler = () => {
        props.onDelete(props.index);
    };

    return(
        <li className={classes.newQuestion}>
            <div className={classes.formGroup}>
                <span className={classes.inputSpan}>{props.index + 1}</span>
                <span className={classes.inputQuestion}>
                    <input type="text"  required value={props.value} onChange={onChangeHandler}/>
                </span>
                <span className={classes.removeIcon} onClick={deleteHandler}><img src={deleteIcon} alt='delete' width='20'/></span>
            </div>
        </li>    
    );
};

export default NewQuestion;