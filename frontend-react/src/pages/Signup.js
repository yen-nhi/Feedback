import { useRef, useState, useContext } from 'react';
import Button from '../UI/Button';
import classes from './Signup.module.css';
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
            <Link className={classes.toLogIn} to='/login'>Log in</Link>
        </Modal>;

    const SubmitHandler = (event) => {
        event.preventDefault();

        if (existingEmail || existingName || !isPasswordValid || !isPasswordsMatch) {
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
        <div>
            {informing && redirectToLogin}
            <div className={classes.registerBox}>
                {isLoading && <LoadingSpinner/>}
                {hasError && <p>{hasError}</p>}
                <form onSubmit={SubmitHandler}>
                    <p>Create an account right away!</p>
                    <hr/>
                    <div className={classes.formGroup}>
                        <input type="email" className="form-input" placeholder="* Email" required="required" ref={email} onBlur={checkEmail}/>
                        {existingEmail && <p className={classes.warning}>This email already exists.</p>}
                        <input type="text" className="form-input" placeholder="* Business's name" required="required" ref={name} onBlur={checkName}/>
                        {existingName && <p className={classes.warning}>This name already exists.</p>}
                        <input type="password" className="form-input" name="password" placeholder="* Password" required="required" ref={password} onBlur={checkPassword}/>
                        {!isPasswordValid && <p className={classes.warning}>Password must be at least 8 characters.</p>}
                        <input type="password" className="form-input" name="confirm_password" placeholder="* Confirm Password" required="required" ref={rePassword} onBlur={checkRePassword}/>
                        {!isPasswordsMatch && <p className={classes.warning}>Re-typed password does not match!</p>}
                    </div>
                    <div className="form-group">
                        <Button>Sign up</Button>
                    </div>
                </form>
                <div className={classes.loginLink}>
                    Already had an account? <span><Link to='/login'>Log in</Link></span>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
