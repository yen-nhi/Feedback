import React, { useState } from "react";

export const SurveyorContext = React.createContext({
    surveyorID: null,
    updateSurveyorID: () => {}
});


const SurveyorContextProvider = (props) => {
    const [surveyorID, setSurveyorID] = useState(null);

    const updateSurveyorIDHandler = (id) => {
        setSurveyorID(id);
    };

    const context = {
        surveyorID: surveyorID,
        updateSurveyorID: updateSurveyorIDHandler
    }

    return (<SurveyorContext.Provider value={context}>
                {props.children}
            </SurveyorContext.Provider>
            );
};

export default SurveyorContextProvider;