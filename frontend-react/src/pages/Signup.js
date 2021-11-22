import { useRef, useState, useContext } from 'react';
import Button from '../UI/Button';
import './Signup.css';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/use-fetch';
import LoadingSpinner from '../UI/LoadingSpinner';
import EndpointContext from '../store/api-endpoint';


const SignUp = () => {
    const apiRoot = useContext(EndpointContext);
    const email = useRef('');
    const name = useRef('');
    const password = useRef('');
    const rePassword = useRef('');

    const [existingEmail, setExistingEmail] = useState(false);
    const [existingName, setExistingName] = useState(false);
    const [isPasswordsMatch, setIsPasswordsMatch] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);

    const { isLoading, hasError, recievedData, fetchData } = useFetch();

    const checkEmail = () => {
        if (email.current.value.trim() !== '') {
            fetch(`${apiRoot.url}/register/existing-client/email/${email.current.value}`)
            .then(res => res.json()).then(result => {
                if (result.message === 'true') {
                    setExistingEmail(true);
                } else {
                    setExistingEmail(false);
                }
            });
        }
    };

    const checkName = () => {
        if (name.current.value.trim() !== '') {
            fetch(`${apiRoot.url}/register/existing-client/name/${name.current.value}`)
            .then(res => res.json()).then(result => {
                if (result.message === 'true') {
                    setExistingName(true);
                } else {
                    setExistingName(false);
                }
            });    
        }
    };

    const checkPassword = () => {
        if (password.current.value.length < 8) {
            setIsPasswordValid(false);
        } else {
            setIsPasswordValid(true);
        }
    };

    const checkRePassword = () => {
        if (password.current.value !== rePassword.current.value) {
            setIsPasswordsMatch(false);
        } else {
            setIsPasswordsMatch(true);
        }
    };

    const SubmitHandler = (event) => {
        event.preventDefault();
        console.log('click Sign Up!');

        if (existingEmail || existingName || !isPasswordValid || !isPasswordsMatch) {
            console.log('Invalid form!')
            return;
        }

        const object = {
            email: email.current.value,
            name: name.current.value,
            password: password.current.value,
        }

        console.log('new user input', object);
        fetchData(`${apiRoot.url}/register`, 'POST', object);
        console.log(recievedData);
        email.current.value = '';
        name.current.value = '';
        password.current.value = '';
        rePassword.current.value = '';
    };
    return (
        <div id="register-background">
            <div className="register-box">
                {isLoading && <LoadingSpinner/>}
                {hasError && <p>{hasError}</p>}
                <form onSubmit={SubmitHandler}>
                    <p>Create an account right away!</p>
                    <hr/>
                    <div className="form-group">
                        <input type="email" className="form-control" placeholder="* Email" required="required" ref={email} onBlur={checkEmail}/>
                        {existingEmail && <p className='warning'>This email already exists.</p>}
                    </div>
                    <div className="form-group">
                        <input type="text" className="form-control" placeholder="* Business's name" required="required" ref={name} onBlur={checkName}/>
                        {existingName && <p className='warning'>This name already exists.</p>}
                    </div>
                    <div className="form-group">
                        <input type="password" className="form-control" name="password" placeholder="* Password" required="required" ref={password} onBlur={checkPassword}/>
                        {!isPasswordValid && <p className='warning'>Password must be at least 8 characters.</p>}
                    </div>
                    <div className="form-group">
                        <input type="password" className="form-control" name="confirm_password" placeholder="* Confirm Password" required="required" ref={rePassword} onBlur={checkRePassword}/>
                        {!isPasswordsMatch && <p className='warning'>Re-typed password does not match!</p>}
                    </div>        
                    <div className="form-group">
                        <Button>Sign up</Button>
                    </div>
                </form>
                <div className="login-link">
                    Already had an account? <Link to='/login'>Log in</Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
