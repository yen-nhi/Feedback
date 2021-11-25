import { useContext } from 'react';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import './DraftWarning.css';
import useFetch from '../hooks/use-fetch';
import EndpointContext from '../store/api-endpoint';


const DraftWarning = (props) => {
    const { recievedData, fetchData } = useFetch();
    const apiRoot = useContext(EndpointContext);

    const object = {...props.object(), draft_id: props.id}
    const replaceDraft = () => {
        fetchData(`${apiRoot.url}/new-draft`, 'POST', object);
        console.log(recievedData);
        props.onClose();
    };

    return(
        <Modal onClose={props.onClose}>
            <p>There is a existing survey's title. Do you want to replace?</p>
            <Button onClick={replaceDraft}>Yes</Button>
            <Button onClick={props.onClose}>No</Button>
        </Modal>
    )
};

export default DraftWarning;