import Button from '../UI/Button';
import './Login.css';
import { Link, useHistory } from 'react-router-dom';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { clientActions } from '../store/client';

const Login = () => {
    const email = useRef('');
    const password = useRef('');
    const [invaidUser, setInvalidUser] = useState(false);

    const dispatch = useDispatch();
    const history = useHistory();

    const logInHandler = (event) => {
        event.preventDefault();
        console.log('Login');
        fetch('http://127.0.0.1:5000/login', {
            method: 'PUT',
            body: JSON.stringify({
                email: email.current.value,
                password: password.current.value
            })
        }).then(res => res.json()).then(data => {
            if (data.status) {
                setInvalidUser(true);
                return
            }
            console.log(data);
            dispatch(clientActions.login({id: data.user_id, token: data.token}));
            localStorage.setItem('token', data.token);
            localStorage.setItem('id', data.user_id);
            history.replace('/');
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
                    Don't have an account? <Link to='/signup'>Register</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;