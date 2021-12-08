import { useEffect, useContext } from 'react';
import Modal from '../../UI/Modal';
import './AccountInfo.css';
import useFetch from '../../hooks/use-fetch'
import LoadingSpinner from '../../UI/LoadingSpinner';
import EndpointContext from '../../store/api-endpoint';

const AccountInfo = (props) => {
    const { isLoading, hasError, recievedData, fetchData } = useFetch();
    const apiRoot = useContext(EndpointContext);

    useEffect( () => {
        fetchData(`${apiRoot.url}/accounts/profile`, 'GET', null, null);
        // eslint-disable-next-line
    }, []);
         
    return(
        <Modal onClose={props.onClose}>
            <div>
                {isLoading && <LoadingSpinner/>}
                {hasError && <p>Get data failed!</p>}
                <div>
                    <p><span className='info-title'>Name</span>{recievedData.name}</p>
                    <p><span className='info-title'>Email</span>{recievedData.email}</p>
                </div>
            </div>
        </Modal>
    )
};

export default AccountInfo;