import React from 'react';
import classes from './Layout.module.css';
import MainHeader from './MainHeader';

const Layout = (props) => {
    return(
        <React.Fragment>
            <MainHeader />
            <div className={classes.container}>{props.children}</div>
        </React.Fragment>
    )
};

export default Layout;