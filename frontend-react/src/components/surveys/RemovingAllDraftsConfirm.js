import { useContext } from 'react';
import Button from '../../UI/Button';
import Modal from '../../UI/Modal';
import useFetch from '../../hooks/use-fetch';
import EndpointContext from '../../store/api-endpoint';


const DraftWarning = (props) => {
    const { recievedData, fetchData } = useFetch();
    const apiRoot = useContext(EndpointContext);

    const removingDrafts = () => {
        fetchData(`${apiRoot.url}/drafts`, 'DELETE', null, null);
        console.log(recievedData);
        props.onDone();
        props.onClose();
    };

    return(
        <Modal onClose={props.onClose}>
            <p>Are you sure you want to remove all drafts?</p>
            <div className='replace-button'>
                <Button onClick={removingDrafts}>Yes</Button>
                <Button onClick={props.onClose}>No</Button>
            </div>
        </Modal>
    )
};

export default DraftWarning;