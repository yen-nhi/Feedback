import './ChartBar.css';


const ChartBar = (props) => {

    const avgScore = parseFloat(props.avgScore.toFixed(1));
    const percent = (props.avgScore/5)*100 + '%';

    return(
        <div className='chart-bar'>
            <div className='filling' style={{width: percent}}><span>{avgScore}</span></div>
        </div>
    )
};

export default ChartBar;