import { useEffect } from 'react';
import Modal from '../UI/Modal';
import './AccountInfo.css';
import useFetch from '../hooks/use-fetch'
import LoadingSpinner from '../UI/LoadingSpinner';

const AccountInfo = (props) => {
    const { isLoading, hasError, recievedData, fetchData } = useFetch();

    useEffect( () => {
        fetchData(`http://127.0.0.1:5000/${props.id}/info`, 'PUT', {token: localStorage.getItem('token')});
    }, []);

    const info = recievedData.map(client => {
        let date = new Date(client.token_exp);
        date.setDate(date.getDate() - 1)
        return(
            <div>
                <p><span className='info-title'>Name</span>{client.name}</p>
                <p><span className='info-title'>Email</span>{client.email}</p>
                <p><span className='info-title'>Last login</span>{date.toString()}</p>
            </div>)
        })
    
    return(
        <Modal onClose={props.onClose}>
            <div>
                {isLoading && <LoadingSpinner/>}
                {hasError && <p>Get data failed!</p>}
                {info}
            </div>
        </Modal>
    )
};

export default AccountInfo;