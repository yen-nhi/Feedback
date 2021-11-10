import './Account.css';
import userIcon from '../media/user.png';
import surveyIcon from '../media/essay.png';
import reportIcon from '../media/line-chart.png';
import ChangePasswordForm from '../components/ChangePasswordForm';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { accountActions } from '../store/account';
import AccountInfo from '../components/AccountInfo';


const Account = () => {
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

    const params = useParams();

    useEffect( () => {
        fetch(`http://127.0.0.1:5000/${params.clientID}/surveys`)
        .then(res => res.json())
        .then(data => {
            setSurveys(data);
        })
        .catch(err => console.log(err));
    }, []);


    const surveysList = (
        <ul className='inner'>
            {surveys.map(item => <li key={item.id} title={item.name}><Link to={{ pathname: `/account/${params.clientID}/surveys/${item.id}`, state: { title:  item.name}}}>{item.name}</Link></li>)}
        </ul>
    );

    const profileInner = (
        <ul className='inner'>
            <li onClick={showInfoHandler}>Account infomation</li>
            <li onClick={changeingPasswordToggle}>Change password</li>
        </ul>
    );

    const reportsInner = (
        <div className='inner'>
            <p>Reports</p>
        </div>
    );

    return (
        <React.Fragment>
            {changeingPassword && <ChangePasswordForm onClose={changeingPasswordToggle} id={params.clientID}/>}
            {showInfo && <AccountInfo onClose={showInfoHandler} id={params.clientID}/>}
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