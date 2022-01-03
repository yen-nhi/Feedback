import classes from './Account.module.css';
import userIcon from '../media/user.png';
import surveyIcon from '../media/essay.png';
import reportIcon from '../media/line-chart.png';
import trashBinIcon from '../media/trash-bin.png';
import removeIcon from '../media/close.png';
import ChangePasswordForm from '../components/account/ChangePasswordForm';
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { accountActions } from '../store/account';
import AccountInfo from '../components/account/AccountInfo';
import EndpointContext from '../store/api-endpoint';
import RemovingAllDraftsConfirm from '../components/surveys/RemovingAllDraftsConfirm';

const Account = () => {
    const apiRoot = useContext(EndpointContext);
    const account = useSelector(state => state.account);
    const dispatch = useDispatch();
    const [surveys, setSurveys] = useState([]);
    const [drafts, setDrafts] = useState([]);
    const [showDrafts, setShowDrafts] = useState(false);
    const [changeingPassword, setChangingPassword] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [isRemovingAllDrafts, setIsRemovingAllDrafts] = useState(false);

    const routes = {
        newSurvey: '/new-survey',
        surveyDetail: '/account/surveys/',
        surveyReport: '/account/reports/'
    };

    const changeingPasswordToggle = () => {setChangingPassword(!changeingPassword)};
    const showInfoHandler = () => {setShowInfo(!showInfo)};

    const header = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
    }

    useEffect( () => {
        fetch(`${apiRoot.url}/surveys`, {headers: header}).then(res => res.json())
        .then(data => {
            setSurveys(data.data);
        })

        fetch(`${apiRoot.url}/drafts`, {headers: header}).then(res => res.json())
        .then(data => {
            setDrafts(data.data);
        })

        // eslint-disable-next-line
    }, []);   
    
    const removeDraft = (id) => {
        fetch(`${apiRoot.url}/surveys/${id}`, {
            method: 'DELETE',
            headers: header
        });
        setDrafts(drafts.filter(draft => draft.id !== id));
    }

    const removeAllDrafts = () => {
        setIsRemovingAllDrafts(true);
    }

    const onCloseConfirming = () => {setIsRemovingAllDrafts(false)};
    
    const onDoneHanler = () => setDrafts([]);
    const showDraftsHandler = () => setShowDrafts(!showDrafts);

    const surveysList = 
        
        (surveys.length === 0 ? <p className={classes.inner}>You have no survey. <Link to={routes.newSurvey}>Create survey</Link></p>
            : 
            <ul className={classes.inner}>
                {surveys.map(item => <li key={item.id} title={item.name}><Link to={{ pathname: routes.surveyDetail + `${item.id}`, state: { title:  item.name}}}>{item.name}</Link></li>)}
                <div>
                    <p className={classes.draftsEl} onClick={showDraftsHandler}>Drafts</p>
                    {showDrafts &&
                    <ul>
                        {drafts.map(item => <li key={item.id} title={item.name}>
                                <img src={removeIcon} alt='icon' className={classes.removeIcon} onClick={() => removeDraft(item.id)}/>
                                <Link to={{ pathname: routes.newSurvey, state: { draft:  item.id, name: item.name}}}>{item.name}</Link>
                            </li>)}
                        <li><button className={classes.clearDrafts} onClick={removeAllDrafts}><img src={trashBinIcon} alt='icon' width='25'/> Clear all drafts</button></li>
                    </ul>}
                    
                </div>
            </ul>         
            );

    const profileInner = (
        <ul className={classes.inner}>
            <li onClick={showInfoHandler}>Account infomation</li>
            <li onClick={changeingPasswordToggle}>Change password</li>
        </ul>
    );

    const reportsInner = 
            (surveys.length === 0 ? <p className={classes.inner}>No survey found</p>
            :
            <ul className={classes.inner}>
                {surveys.map(item => <li key={item.id} title={item.name}><Link to={{ pathname: routes.surveyReport + `${item.id}`, state: { title:  item.name}}}>Report on {item.name}</Link></li>)}
            </ul>);
 

    return (
        <React.Fragment>
            {changeingPassword && <ChangePasswordForm onClose={changeingPasswordToggle}/>}
            {showInfo && <AccountInfo onClose={showInfoHandler}/>}
            {isRemovingAllDrafts && 
                <RemovingAllDraftsConfirm onClose={onCloseConfirming}
                onDone={onDoneHanler}/>
            }
            <div className={classes.account}>
                <div className={classes.category} onClick={() => dispatch(accountActions.profileToggle())}>
                    <img src={userIcon} alt='icon' width='40'/>Your profile
                </div>
                {account.profile && profileInner}
                <div className={classes.category} onClick={() => dispatch(accountActions.surveysToggle())}>
                    <img src={surveyIcon} alt='icon' width='40'/>Your surveys
                </div>
                {account.surveys && surveysList}
                <div className={classes.category} onClick={() => dispatch(accountActions.reportsToggle())}>
                    <img src={reportIcon} alt='icon' width='40'/>Analysis   
                </div>
                {account.reports && reportsInner}
            </div>
        </React.Fragment>
    )
};

export default Account;