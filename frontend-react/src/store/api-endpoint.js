import React from 'react';

const EndpointContext = React.createContext({
    url: process.env.REACT_APP_API_ENDPOINT_ROOT,
    endpoint: process.env.REACT_APP_ENDPOINT
});

export const EndpointProvider = (props) => {
    return(
        <EndpointContext.Provider 
            value={
                { url: process.env.REACT_APP_API_ENDPOINT_ROOT,
                endpoint: process.env.REACT_APP_ENDPOINT
                }}>
            {props.children}
        </EndpointContext.Provider>
    )
};

export default EndpointContext;