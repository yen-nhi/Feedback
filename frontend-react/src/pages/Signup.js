import { useRef, useState, useContext } from 'react';
import Button from '../UI/Button';
import './Signup.css';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/use-fetch';
import LoadingSpinner from '../UI/LoadingSpinner';
import EndpointContext from '../store/api-endpoint';
import Modal from '../UI/Modal';


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
    const [informing, setInforming] = useState(false);

    const { isLoading, hasError, fetchData } = useFetch();

    const checkEmail = () => {
        if (email.current.value.trim() !== '') {
            fetch(`${apiRoot.url}/accounts?email=${email.current.value}`)
            .then(res => res.json()).then(result => {
                if (result.message === 'Exist') {
                    setExistingEmail(true);
                } else {
                    setExistingEmail(false);
                }
            });
        }
    };

    const checkName = () => {
        if (name.current.value.trim() !== '') {
            fetch(`${apiRoot.url}/accounts?name=${name.current.value}`)
            .then(res => res.json()).then(result => {
                if (result.message === 'Exist') {
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
    const onCloseModal = () => { setInforming(false) };
    const redirectToLogin = <Modal onClose={onCloseModal}>
            <span>Your account has been created! </span>
            <Link className='to-log-in' to='/login'>Log in</Link>
        </Modal>;

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
        const header = {
            'Content-Type': 'application/json',
        }
        fetchData(`${apiRoot.url}/accounts`, 'POST', header, object);

        email.current.value = '';
        name.current.value = '';
        password.current.value = '';
        rePassword.current.value = '';
        setInforming(true);
    };
    return (
        <div id="register-background">
            {informing && redirectToLogin}
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
                    Already had an account? <span><Link to='/login'>Log in</Link></span>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
