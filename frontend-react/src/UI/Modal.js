import React from "react";
import classes from './Modal.module.css';
import closeIcon from '../media/close.png'


const Backdrop = props => {
    return <div className={classes.backdrop} onClick={props.onClose}>{props.children}</div>;
};

const Overlays = props => {
    return (
        <div className={`${classes.modal} ${props.className}`}>
            <div className={classes.content}>
                <img src={closeIcon} alt='Close' width='25' className={classes.closeIcon} onClick={props.onClose}/>
                {props.children}
            </div>
        </div>
    )
};

const Modal = (props) => {
    return(
        <React.Fragment>
            <Backdrop onClose={props.onClose}/>
            <Overlays onClose={props.onClose}>{props.children}</Overlays>
        </React.Fragment>
    )
};

export default Modal;