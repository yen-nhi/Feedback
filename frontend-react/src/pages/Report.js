import React, {useEffect} from 'react';
import BarChart from '../components/BarChart';
import './Report.css';
import useFetch from '../hooks/use-fetch';
import { useParams } from 'react-router-dom';

const Report = (props) => {
    const params = useParams();
    const { isLoading, hasError, recievedData, fetchData } = useFetch();

    useEffect( () => {
        fetchData(`http://127.0.0.1:5000/${params.clientID}/surveys/${params.surveyID}`, 'GET', null);
    }, []);

    const chart = recievedData.map((question, i) => 
        <li key={question.id}>
            <h5>{`Question ${i+1}. ${question.question}`}</h5>
            <div>
                <p>Total vote for each score level</p>
                <BarChart questionID={question.id}/>
            </div>
        </li>);

    return(
        <ul className='report'>
            {chart}
        </ul>
        
    )
};

export default Report;