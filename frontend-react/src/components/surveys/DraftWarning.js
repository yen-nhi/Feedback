import { useContext } from 'react';
import Button from '../../UI/Button';
import Modal from '../../UI/Modal';
import './DraftWarning.css';
import EndpointContext from '../../store/api-endpoint';


const DraftWarning = (props) => {
    const apiRoot = useContext(EndpointContext);

    const object = {...props.object, draft_id: props.id}
    const replaceDraft = () => {
        fetch(`${apiRoot.url}/drafts/${props.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')        
            },
            body: JSON.stringify(object)
        }).then(res => res.json())
        .then(data => {
            console.log(data);
            props.doneReplace();
            props.onClose();    
        });
    };

    return(
        <Modal onClose={props.onClose}>
            <p>There is a existing survey's title. Do you want to replace?</p>
            <div className='replace-button'>
                <Button onClick={replaceDraft}>Yes</Button>
                <Button onClick={props.onClose}>No</Button>
            </div>
        </Modal>
    )
};

export default DraftWarning;