import image from '../media/thankyou1.png';
import './Thankyou.css';

const Thankyou = () => {
    return(
        <div className="thankyou">
            <img src={image} alt="thank you" />
        </div>
    )
};

export default Thankyou;