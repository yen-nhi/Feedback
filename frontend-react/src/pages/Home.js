import ColumnCard from "../UI/ColumnCard";
import classes from './Home.module.css';
import { Link } from "react-router-dom";
import mainImage from '../media/first-image.png';
import banner3 from '../media/banner/3.png';
import banner5 from '../media/banner/5.png';
import video1 from '../media/banner/1.png';
import video2 from '../media/banner/2.mp4';
import addressIcon from '../media/home-address.png';
import emailIcon from '../media/email.png';
import phoneIcon from '../media/phone.png';


const Home = (props) => {

    const content = (
        <div className={classes.cardContent}>
            <div>
                <p className={classes.bannerTitle}>We provide a solution for your business</p>
                <p className={classes.bannerBody}>You build surveys, we build data for your reports.</p>
                <p className={classes.bannerBody}>Let us help you</p>
                <br/>
                <Link to='/login'><button className={classes.joinUsBtn}>Join us</button></Link>
            </div>   
        </div>
    )
    return(
            <div className={classes.home}>
                <div className={classes.bannerMain}>
                    <ColumnCard
                        className={classes.homeCard}
                        leftColumn={<img src={mainImage} alt='image'/>}
                        rightColumn={content}
                        reverse={false}
                    />
                </div>
                <div className={classes.banner}>
                    <img src={video1} alt="banner"/>
                    <div className={classes.bannerContent1}>
                        <p className={classes.bannerTitle}>WHAT IS FEEDBACK?</p>
                        <p className={classes.bannerBody}>We have created a free tool</p>
                        <p className={classes.bannerBody}>to help you develop your business</p>
                        <p className={classes.bannerBody}>by analysing feedback from your customers</p>
                    </div>
                </div>
                <div className={classes.banner}>
                    <video src={video2} type="video/mp4" width="100%" autoPlay muted></video>
                </div>
                <div className={classes.banner}>
                    <img src={banner3} alt="banner" />
                </div>
                <div className={classes.banner}>
                    <img src={banner5} alt="banner" />
                    <div className={classes.contact}>
                        <p className={classes.forMoreInfo}>For more information, don't be hestitate to contact us.</p>
                        <p><img src={addressIcon} alt="icon" /><span>Mailing : </span><span>Floor 3, 100 Fantastic Road, Rostov na Donu City, Rostov region.</span></p>
                        <p><img src={emailIcon} alt="icon" /><span>Email : </span><span>feedback.db@gmail.com</span></p>
                        <p><img src={phoneIcon} alt="icon" /><span>Phone : </span><span>(+7) 123 456 789</span></p>
                    </div>
                </div>

                      
            </div>  
    )
};

export default Home;