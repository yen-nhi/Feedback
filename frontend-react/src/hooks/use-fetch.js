import { useState } from "react";


const useFetch =  () => {
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(null);
    const [recievedData, setRecievedData] = useState([]);
 
    const fetchData = async(url, method, object) => {
        try {
            setIsLoading(true);
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: method,
                body: (object ? JSON.stringify({...object}) : null)
            });

            if (!response.ok) {
                setIsLoading(false);
                setHasError('Something went wrong!');    
            }
    
            const data = await response.json();
            console.log('data fetched: ', data);
            setRecievedData(data);
            setIsLoading(false);
            
        } catch (err) {
            console.log(err);
        } 
     
    }

    return{ isLoading, hasError, recievedData, fetchData };
};

export default useFetch;