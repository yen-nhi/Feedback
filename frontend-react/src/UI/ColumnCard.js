import classes from './ColumnCard.module.css';

const ColumnCard = (props) => {
    return(
        <div className={classes.card}>
            <div className={`${props.reverse ? classes.smallLeftColumn : classes.leftColumn} ${props.className}`}>
                {props.leftColumn}
            </div>
            <div className={`${props.reverse ? classes.smallRightColumn : classes.rightColumn} ${props.className}`}>
                {props.rightColumn}
            </div>
        </div>
    );
};

export default ColumnCard;