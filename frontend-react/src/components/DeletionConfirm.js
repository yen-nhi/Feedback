import { useContext } from 'react';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import './DeletionConfirm.css';
import useFetch from '../hooks/use-fetch';
import { useHistory } from 'react-router-dom';
import EndpointContext from '../store/api-endpoint';

const DeletionConfirm = (props) => {
    const apiRoot = useContext(EndpointContext);
    const history = useHistory();
    const { fetchData } = useFetch();
    const clientID = localStorage.getItem('id');

    

    const deleteSurveyHandler = () => {
        console.log('Yes!');
        fetchData(`${apiRoot.url}/surveys/${props.surveyID}`, 'DELETE', null, {token: localStorage.getItem('token')});
        history.push(`/account`)
    };

    return(
        <Modal onClose={props.onClose}>
            <p>{`Are you sure that you want to remove the survey "${props.title}"?`}</p>
            <div className='control-buttons'>
                <Button onClick={deleteSurveyHandler}>Yes</Button>
                <Button onClick={props.onClose}>No</Button>
            </div>
        </Modal>
    )
};

export default DeletionConfirm;