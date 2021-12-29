import ColumnCard from "../UI/ColumnCard";
import './Home.css';
import { Link } from "react-router-dom";
import banner3 from '../media/banner/3.png';
import banner5 from '../media/banner/5.png';
import video1 from '../media/banner/1.png';
import video from '../media/banner.mp4';
import video2 from '../media/banner/2.mp4';
import addressIcon from '../media/home-address.png';
import emailIcon from '../media/email.png';
import phoneIcon from '../media/phone.png';


const Home = (props) => {

    const content = (
        <div className='card-content'>
            <div>
                <p className="banner-title">We provide a solution for your business</p>
                <p className="banner-body">Let us help you</p>
                <br/>
                <Link to='/login'><button className="join-us-btn">Join us</button></Link>
            </div>   
        </div>
    )
    return(
            <div className='home'>
                <div className="banner-main">
                    <ColumnCard
                        className='home-card'
                        leftColumn={<video src={video} type="video/mp4" autoPlay muted width="100%"></video>}
                        rightColumn={content}
                        reverse={false}
                    />
                </div>
                <div className="banner">
                    <img src={video1} alt="banner"/>
                    <div className="banner-content-1">
                        <p className="banner-title">WHAT IS FEEDBACK?</p>
                        <p className="banner-body">We have created a free tool</p>
                        <p className="banner-body">to help you develop your business</p>
                        <p className="banner-body">by analysing feedback from your customers</p>
                    </div>
                </div>
                <div className="banner">
                    <video src={video2} type="video/mp4" width="100%" autoPlay muted></video>
                </div>
                <div className="banner">
                    <img src={banner3} alt="banner" />
                </div>
                <div className="banner">
                    <img src={banner5} alt="banner" />
                    <div className="contact">
                        <p className="for-more-info">For more information, don't be hestitate to contact us.</p>
                        <p><img src={addressIcon} alt="icon" /><span>Mailing : </span><span>Floor 3, 100 Fantastic Road, Rostov na Donu City, Rostov region.</span></p>
                        <p><img src={emailIcon} alt="icon" /><span>Email : </span><span>feedback.db@gmail.com</span></p>
                        <p><img src={phoneIcon} alt="icon" /><span>Phone : </span><span>(+7) 123 456 789</span></p>
                    </div>
                </div>

                      
            </div>  
    )
};

export default Home;