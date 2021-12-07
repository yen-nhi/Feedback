import classes from './ButtonOutline.module.css';

const ButtonOutline = (props) => {
    return(
        <button 
            className={`${classes.buttonOutline} ${props.className}`} 
            onClick={props.onClick} 
            disabled={props.disabled}
            type={props.type}>
            {props.children}
        </button>
    )
};

export default ButtonOutline;