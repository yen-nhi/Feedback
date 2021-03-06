import { useContext } from 'react';
import Button from '../../UI/Button';
import Modal from '../../UI/Modal';
import classes from './DeletionConfirm.module.css';
import { useHistory } from 'react-router-dom';
import EndpointContext from '../../store/api-endpoint';

const DeletionConfirm = (props) => {
    const apiRoot = useContext(EndpointContext);
    const history = useHistory();
    

    const deleteSurveyHandler = () => {
        fetch(`${apiRoot.url}/surveys/${props.surveyID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        })
        history.replace(`/account`)
    };

    return(
        <Modal onClose={props.onClose}>
            <p>{`Are you sure that you want to remove the survey "${props.title}"?`}</p>
            <div className={classes.controlButtons}>
                <Button onClick={deleteSurveyHandler}>Yes</Button>
                <Button onClick={props.onClose}>No</Button>
            </div>
        </Modal>
    )
};

export default DeletionConfirm;