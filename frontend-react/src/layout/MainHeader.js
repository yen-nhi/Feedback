import classes from './MainHeader.module.css';
import { NavLink, useHistory } from 'react-router-dom';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clientActions } from '../store/client';

import logo from '../media/logo2.png';
import menuIcon from '../media/menu.svg';

const MainHeader = () => {

    const user = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const history = useHistory();
    const [mobileResponsive, setMobileResponsive] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const showMenuHandler = () => {
        setShowMenu(!showMenu);
    };

    const logoutHandler = () => {
        fetch(`http://127.0.0.1:5000/logout/${user.id}`, {method: 'PUT'})
            .then(res => res.json()).then(data => console.log(data));
        dispatch(clientActions.logout());
        console.log(user)
        history.replace('/')
    };


    const navBar = (
            <ul className={classes.nav}>
                {user.isAuthenticated && 
                <li>
                    <NavLink to={`/account/${localStorage.getItem('id')}`}>My account</NavLink>
                </li>}
                {user.isAuthenticated && 
                <li>
                    <NavLink to='/new-survey'>Create survey</NavLink>
                </li>}
                {user.isAuthenticated &&
                    <li onClick={logoutHandler}>
                        <NavLink to='/'>Logout</NavLink>
                    </li>}
                {!user.isAuthenticated && 
                    <li>
                        <NavLink to='/signup'>Join our network</NavLink>
                    </li>}
                {!user.isAuthenticated && 
                    (<li>
                        <NavLink to='/login'>Login</NavLink>
                    </li>)}
                <li>
                    <NavLink to='/'>About us</NavLink>
                </li>
            </ul>
        )

    const menu = (
        <div>
            <img src={menuIcon} alt='menu-icon' className={classes.menuIcon} width='30' onClick={showMenuHandler}/>
            {showMenu &&
                <ul className={classes.menuNav}>
                    {user.isAuthenticated && 
                    <li onClick={logoutHandler}>
                        <NavLink to='/'>My account</NavLink>
                    </li>}
                    {user.isAuthenticated && 
                     <li onClick={logoutHandler}>
                        <NavLink to='/'>Logout</NavLink>
                    </li>}
                    {!user.isAuthenticated &&
                    <li>
                        <NavLink to='/signup' onClick={showMenuHandler}>Join our network</NavLink>
                    </li>}
                    <li>
                        <NavLink to='/' onClick={showMenuHandler}>About us</NavLink>
                    </li>
            </ul>}
        </div>
    );

    window.onresize = () => {
        if ( window.innerWidth < 756 ) {
            setMobileResponsive(true);
        } else {
            setMobileResponsive(false);
        }
    };

    return(
        <header className={classes.header}>
            <div className={classes.logo}><img src={logo} alt='Logo' width="200"/></div>
            {mobileResponsive ? menu : navBar}
        </header>
    );
};

export default MainHeader;