import './Account.css';
import userIcon from '../media/user.png';
import surveyIcon from '../media/essay.png';
import reportIcon from '../media/line-chart.png';
import ChangePasswordForm from '../components/ChangePasswordForm';
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { accountActions } from '../store/account';
import AccountInfo from '../components/AccountInfo';
import EndpointContext from '../store/api-endpoint';
import Modal from '../UI/Modal';

const Account = () => {
    const apiRoot = useContext(EndpointContext);
    const account = useSelector(state => state.account);
    const dispatch = useDispatch();
    const [surveys, setSurveys] = useState([]);
    const [changeingPassword, setChangingPassword] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    const profileToggle = () => {dispatch(accountActions.profileToggle())};
    const surveysToggle = () => {dispatch(accountActions.surveysToggle())};
    const reportsToggle = () => {dispatch(accountActions.reportsToggle())};

    const changeingPasswordToggle = () => {setChangingPassword(!changeingPassword)};
    const showInfoHandler = () => {setShowInfo(!showInfo)};

    const clientID = localStorage.getItem('id');

    useEffect( () => {
        fetch(`${apiRoot.url}/${clientID}/surveys`)
        .then(res => res.json())
        .then(data => {
            setSurveys(data);
        })
        .catch(err => console.log(err));
        // eslint-disable-next-line
    }, []);


    const surveysList = 
        <div>
        {surveys.length === 0 ? <p className='inner'>You have no survey. <Link to={'/new-survey'}>Create survey</Link></p>
            : 
            <ul className='inner'>
                {surveys.map(item => <li key={item.id} title={item.name}><Link to={{ pathname: `/account/${clientID}/surveys/${item.id}`, state: { title:  item.name}}}>{item.name}</Link></li>)}
            </ul>}
        </div>;

    const profileInner = (
        <ul className='inner'>
            <li onClick={showInfoHandler}>Account infomation</li>
            <li onClick={changeingPasswordToggle}>Change password</li>
        </ul>
    );

    const reportsInner = 
        <div>
            {surveys.length === 0 ? <p className='inner'>No survey found</p>
            :
            <ul className='inner'>
                {surveys.map(item => <li key={item.id} title={item.name}><Link to={{ pathname: `/account/${clientID}/reports/${item.id}`, state: { title:  item.name}}}>Report on {item.name}</Link></li>)}
            </ul>}
        </div>;
 

    return (
        <React.Fragment>
            {changeingPassword && <ChangePasswordForm onClose={changeingPasswordToggle}/>}
            {showInfo && <AccountInfo onClose={showInfoHandler}/>}
            <div className='account'>
                <div className='category' onClick={profileToggle}>
                    <img src={userIcon} alt='icon' width='40'/>Your profile
                </div>
                {account.profile && profileInner}
                <div className='category' onClick={surveysToggle}>
                    <img src={surveyIcon} alt='icon' width='40'/>Your surveys
                </div>
                {account.surveys && surveysList}
                <div className='category' onClick={reportsToggle}>
                    <img src={reportIcon} alt='icon' width='40'/>Analysis   
                </div>
                {account.reports && reportsInner}
            </div>
        </React.Fragment>
    )
};

export default Account;