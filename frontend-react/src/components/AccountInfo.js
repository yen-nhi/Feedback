import { useEffect } from 'react';
import Modal from '../UI/Modal';
import './AccountInfo.css';
import useFetch from '../hooks/use-fetch'
import LoadingSpinner from '../UI/LoadingSpinner';

const AccountInfo = (props) => {
    const { isLoading, hasError, recievedData, fetchData } = useFetch();

    useEffect( () => {
        fetchData(`http://127.0.0.1:5000/${localStorage.getItem('id')}/info`, 'PUT', {token: localStorage.getItem('token')});
    }, []);
     
    let date = new Date(recievedData[2]);
    date.setDate(date.getDate() - 1)
    const info = 
        <div>
            <p><span className='info-title'>Name</span>{recievedData[0]}</p>
            <p><span className='info-title'>Email</span>{recievedData[1]}</p>
            <p><span className='info-title'>Last login</span>{date.toString()}</p>
        </div>;
    
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