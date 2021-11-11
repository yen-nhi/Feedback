import Button from '../UI/Button';
import Modal from '../UI/Modal';
import './DeletionConfirm.css';

const DeletionConfirm = (props) => {
    return(
        <Modal onClose={props.onClose}>
            <p>{`Are you sure that you want to remove the survey "${props.title}"?`}</p>
            <div className='control-buttons'>
                <Button>Yes</Button>
                <Button onClick={props.onClose}>No</Button>
            </div>
        </Modal>
    )
};

export default DeletionConfirm;