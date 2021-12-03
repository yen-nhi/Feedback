import { useState } from "react";


const useFetch =  () => {
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(null);
    const [recievedData, setRecievedData] = useState([]);
 
    const fetchData = async(url, method, customHeader, body) => {
        let header = customHeader;
        if (customHeader === null) {
            header = {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        }
        
        try {
            setIsLoading(true);
            const response = await fetch(url, {
                method: method,
                headers: header,
                body: (body ? JSON.stringify({...body}) : null)
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