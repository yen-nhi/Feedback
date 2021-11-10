import React from "react";
import './Opening.css';
import righArrowIcon from '../media/right-arrow.png';
import { Link } from "react-router-dom";


const Opening = () => {
    return(
        <div>
            <div className='banner'>
            </div>
            <div className="opening">
                <div className='opening-text'>
                    <h3>You have been a customer of some Business</h3>
                    <h1>Your feedback is super important for us!</h1>
                    <p>Only a few minutes, please feel free to let us know what you think about our services.</p>
                    <p>We assure that every information is confidential.</p>
                </div>
                <div className='start-button'>
                    <Link to='/survey/1'><button><span>Start you survey</span><img className='arrow-icon' src={righArrowIcon} alt='Arrow-icon' width='30'/></button></Link>
                </div>
                <div className='join-us'>
                    <span>Are you running a business? </span><Link>Join us</Link>
                </div>
            </div>
        </div>
    );
};

export default Opening;