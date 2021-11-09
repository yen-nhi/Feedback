import React from 'react';
import classes from './Layout.css';
import MainHeader from './MainHeader';

const Layout = (props) => {
    return(
        <React.Fragment>
            <MainHeader />
            <main className={classes.main}>{props.children}</main>
        </React.Fragment>
    )
};

export default Layout;