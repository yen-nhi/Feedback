import React, { useReducer } from "react";
import './Score.css';
import Icon1b from '../../media/1b.png';
import Icon1 from '../../media/1.png'; 
import Icon2b from '../../media/2b.png'; 
import Icon2 from '../../media/2.png'; 
import Icon3b from '../../media/3b.png'; 
import Icon3 from '../../media/3.png'; 
import Icon4b from '../../media/4b.png'; 
import Icon4 from '../../media/4.png'; 
import Icon5b from '../../media/5b.png'; 
import Icon5 from '../../media/5.png'; 


const initialState = {
    score1: false,
    score2: false,
    score3: false,
    score4: false,
    score5: false,
}

const scoreReducer = (state, action) => {
    if (action.type === 'CHECKED') {
        let newState = {...initialState};
        newState[action.payload] = true;
        return newState;
    }
    return initialState;
}

const Score = (props) => {

    const [checked, dispatchChecked] = useReducer(scoreReducer, initialState);

    const scoreHandler = (event) => {
        const checkedValue = event.target.parentNode.dataset.value;
        dispatchChecked({ type: 'CHECKED', payload: `score` + checkedValue });
        
        props.onScore(+checkedValue);
    }

    return(
            <div className='score'>
                <div data-value='1' onClick={scoreHandler}>
                    <img src={checked.score1 ? Icon1 : Icon1b} alt='icon 1' width='30'/>
                </div>
                <div data-value='2' onClick={scoreHandler}>
                    <img src={checked.score2 ? Icon2 : Icon2b} alt='icon 2' width='30'/>
                </div>
                <div data-value='3' onClick={scoreHandler}>
                    <img src={checked.score3 ? Icon3 : Icon3b} alt='icon 3' width='30'/>
                </div>
                <div data-value='4' onClick={scoreHandler}>
                    <img src={checked.score4 ? Icon4 : Icon4b} alt='icon 4' width='30'/>
                </div>
                <div data-value='5' onClick={scoreHandler}>
                    <img src={checked.score5 ? Icon5 : Icon5b} alt='icon 5' width='30'/>
                </div>
            </div>
    );
};

export default Score;