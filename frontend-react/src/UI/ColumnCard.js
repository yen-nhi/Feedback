import classes from './ColumnCard.module.css';

const ColumnCard = (props) => {
    return(
        <div className={classes.card}>
            <div className={classes.leftColumn}>
                {props.leftColumn}
            </div>
            <div className={classes.rightColumn}>
                {props.rightColumn}
            </div>
        </div>
    );
};

export default ColumnCard;