import { useEffect, useContext } from 'react';
import Modal from '../../UI/Modal';
import classes from './AccountInfo.module.css';
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
                    <p><span className={classes.infoTitle}>Name :</span>{recievedData.name}</p>
                    <p><span className={classes.infoTitle}>Email: </span>{recievedData.email}</p>
                </div>
            </div>
        </Modal>
    )
};

export default AccountInfo;