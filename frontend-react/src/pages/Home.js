import ColumnCard from "../UI/ColumnCard";
import image from '../media/heading4.png';
import Button from "../UI/Button";
import './Home.css';
import { Link } from "react-router-dom";


const Home = (props) => {
        
    const content = (
        <div className='card-content'>
            <div>
                <h4>We provide a solution for your business</h4>
                <p>Let us help you</p>
                <Link to='/login'><Button>Join us</Button></Link>
            </div>   
        </div>
    )
    return(
        <div className='home-background'>
            <div className='home'>
                <ColumnCard
                    className='home-card'
                    leftColumn={<img src={image} alt='illustration'/>}
                    rightColumn={content}
                    reverse={false}
                />    
            </div>
        </div>
        
    )
};

export default Home;