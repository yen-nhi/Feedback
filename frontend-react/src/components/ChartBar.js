import './ChartBar.css';
import useFetch from '../hooks/use-fetch';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';


const ChartBar = (props) => {
    const params = useParams();
    const { recievedData, fetchData } = useFetch();
    
    useEffect( () => {
        fetchData(`http://127.0.0.1:5000/${params.clientID}/surveys/${params.surveyID}/${props.questionID}/average`, 'GET', null)
    }, []);

    const percentage = (recievedData[0]/5)*100 + '%';

    return(
        <div className='chart-bar'>
            <div className='filling' style={{width: percentage}}><span>{parseFloat(recievedData[0]).toFixed(1)}</span></div>
        </div>
    )
};

export default ChartBar;