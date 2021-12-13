import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import classes from './DatePicker.module.css';
import calendarIcon from '../media/calendar.png';

const DatePickerComponent = () => {
    const [startDate, setStartDate] = useState(new Date());
    return (
        <div className={classes.datePickerOutline}>
            <span><img src={calendarIcon} alt='icon' width={25}/></span>
            <span className={classes.datePicker}>
            <DatePicker 
                selected={startDate} 
                onChange={(date) => setStartDate(date)} 
                dateFormat='dd-MM-yyyy'/>
            </span>
        </div>
    )
};

export default DatePickerComponent;