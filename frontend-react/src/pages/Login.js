import Button from '../UI/Button';
import classes from './Login.module.css';
import { Link, useHistory } from 'react-router-dom';
import { useRef, useState, useContext } from 'react';
import EndpointContext from '../store/api-endpoint';
import { useDispatch } from 'react-redux';
import { clientActions } from '../store/client';


const Login = () => {
    const email = useRef('');
    const password = useRef('');
    const [invaidUser, setInvalidUser] = useState(false);
    const apiRoot = useContext(EndpointContext);
    const history = useHistory();
    const dispatch = useDispatch();

    const logInHandler = (event) => {
        event.preventDefault();
        fetch(`${apiRoot.url}/accounts/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': Buffer(email.current.value + ":" + password.current.value).toString('base64')
            }
        }).then(res => res.json()).then(data => {
            if (data.status === 'Fail') {
                setInvalidUser(true);
                return
            }
            dispatch(clientActions.login({token: data.token}));
            history.replace('/account');
        });
    };


    return (
        <div className={classes.loginBackground}>
            <div className={classes.loginBox}>
                {invaidUser && <p className={classes.warning}>Invalid user.</p>}
                <form method='PUT' onSubmit={logInHandler}>
                    <div className={classes.formGroup}>
                        <input autoFocus className='form-input' type="text" placeholder="Username" ref={email} required/>
                        <input className='form-input' type="password" placeholder="Password" ref={password} required/>
                    </div>
                    <div className={classes.loginButton}>
                        <Button>Log in</Button>
                    </div>
                </form>
                <div className={classes.registerLink}>
                    Don't have an account? <span><Link to='/signup'>Register</Link></span>
                </div>
            </div>
        </div>
    );
};

export default Login;