import Button from '../UI/Button';
import './Login.css';
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
        <div className='login-background'>
            <div className="login-box">
                {invaidUser && <p className='warning'>Invalid user.</p>}
                <form method='PUT' onSubmit={logInHandler}>
                    <div className="form-group">
                        <input autoFocus className="form-control" type="text" placeholder="Username" ref={email} required/>
                    </div>
                    <div className="form-group">
                        <input className="form-control" type="password" placeholder="Password" ref={password} required/>
                    </div>
                    <div className="login-button">
                        <Button>Log in</Button>
                    </div>
                </form>
                <div className="register-link">
                    Don't have an account? <span><Link to='/signup'>Register</Link></span>
                </div>
            </div>
        </div>
    );
};

export default Login;