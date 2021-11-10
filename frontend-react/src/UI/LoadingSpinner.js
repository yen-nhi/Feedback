import classes from './LoadingSpinner.module.css';

const LoadingSpinner = () => {
  return <div className={classes.spinnerContainer}>
            <div className={classes.spinner}><div></div><div></div><div></div><div></div></div>
        </div>;
}

export default LoadingSpinner;
