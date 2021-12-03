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

const Account = () => {
    const apiRoot = useContext(EndpointContext);
    const account = useSelector(state => state.account);
    const dispatch = useDispatch();
    const [surveys, setSurveys] = useState([]);
    const [drafts, setDrafts] = useState([]);
    const [showDrafts, setShowDrafts] = useState(false);
    const [changeingPassword, setChangingPassword] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    const changeingPasswordToggle = () => {setChangingPassword(!changeingPassword)};
    const showInfoHandler = () => {setShowInfo(!showInfo)};

    const header = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
    }

    useEffect( () => {
        fetch(`${apiRoot.url}/surveys`, {
            headers: header
        })
        .then(res => res.json())
        .then(data => {
            setSurveys(data);
        })
        .catch(err => console.log(err));

        fetch(`${apiRoot.url}/drafts`, {headers: header})
        .then(res => res.json())
        .then(data => {
            setDrafts(data);
        })
        .catch(err => console.log(err));

        // eslint-disable-next-line
    }, []);   
    

    const surveysList = 
        <div>
        {surveys.length === 0 ? <p className='inner'>You have no survey. <Link to={'/new-survey'}>Create survey</Link></p>
            : 
            <ul className='inner'>
                {surveys.map(item => <li key={item.id} title={item.name}><Link to={{ pathname: `/account/surveys/${item.id}`, state: { title:  item.name}}}>{item.name}</Link></li>)}
                <div>
                    <p className='drafts-el' onClick={() => setShowDrafts(!showDrafts)}>Drafts</p>
                    {showDrafts &&
                    <ul className='i'>
                        {drafts.map(item => <li key={item.id} title={item.name}><Link to={{ pathname: `/new-survey`, state: { draft:  item.id, name: item.name}}}>{item.name}</Link></li>)}
                    </ul>}
                </div>
            </ul>         
            }
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
                {surveys.map(item => <li key={item.id} title={item.name}><Link to={{ pathname: `/account/reports/${item.id}`, state: { title:  item.name}}}>Report on {item.name}</Link></li>)}
            </ul>}
        </div>;
 

    return (
        <React.Fragment>
            {changeingPassword && <ChangePasswordForm onClose={changeingPasswordToggle}/>}
            {showInfo && <AccountInfo onClose={showInfoHandler}/>}
            <div className='account'>
                <div className='category' onClick={() => dispatch(accountActions.profileToggle())}>
                    <img src={userIcon} alt='icon' width='40'/>Your profile
                </div>
                {account.profile && profileInner}
                <div className='category' onClick={() => dispatch(accountActions.surveysToggle())}>
                    <img src={surveyIcon} alt='icon' width='40'/>Your surveys
                </div>
                {account.surveys && surveysList}
                <div className='category' onClick={() => dispatch(accountActions.reportsToggle())}>
                    <img src={reportIcon} alt='icon' width='40'/>Analysis   
                </div>
                {account.reports && reportsInner}
            </div>
        </React.Fragment>
    )
};

export default Account;