import image from '../media/thankyou1.png';
import classes from './Thankyou.module.css';

const Thankyou = () => {
    return(
        <div className={classes.thankyou}>
            <img src={image} alt="thank you" />
        </div>
    )
};

export default Thankyou;