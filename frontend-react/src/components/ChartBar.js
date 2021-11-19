import './ChartBar.css';
import useFetch from '../hooks/use-fetch';
import { useParams } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import EndpointContext from '../store/api-endpoint';

const ChartBar = (props) => {
    const apiRoot = useContext(EndpointContext);
    const params = useParams();
    const { recievedData, fetchData } = useFetch();
    
    useEffect( () => {
        fetchData(`${apiRoot.url}/${params.clientID}/surveys/${params.surveyID}/${props.questionID}/average`, 'GET', null)
        // eslint-disable-next-line
    }, []);

    const percentage = (recievedData[0]/5)*100 + '%';

    return(
        <div className='chart-bar'>
            <div className='filling' style={{width: percentage}}><span>{parseFloat(recievedData[0]).toFixed(1)}</span></div>
        </div>
    )
};

export default ChartBar;