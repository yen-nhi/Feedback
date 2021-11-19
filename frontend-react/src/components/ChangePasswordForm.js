import './ChangePasswordForm.css';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import { useRef, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import EndpointContext from '../store/api-endpoint';

const ChangePasswordForm = (props) => {
    const apiRoot = useContext(EndpointContext);
    const currentPassword = useRef();
    const newPassword = useRef();
    const confirmPassword = useRef();
    const [ passwordValid, setPasswordValid ] = useState(true);
    const [ newPasswordValid, setNewPasswordValid ] = useState(true);
    const [ rePasswordValid, setRePasswordValid ] = useState(true);

    const history = useHistory();
    const clientID = localStorage.getItem('id');

    const checkCurrentPassword = () => {
        fetch(`${apiRoot.url}/${clientID}/password-update/checking`, {
            method: 'PUT',
            body: JSON.stringify({
                password: currentPassword.current.value,
            })
        }).then(response => response.json())
        .then(result => {
            console.log(result);
            if (result.message !== 'VALID' ) {
                setPasswordValid(false);
            } else {
                setPasswordValid(true);
            }
        }).catch(err => console.log(err));
    };

    const checkNewPassword = () => {
        if (newPassword.current.value.length < 8 || newPassword.current.value === currentPassword.current.value) {
            setNewPasswordValid(false);
        } else {
            setNewPasswordValid(true);
        }
    };

    const checkConfirmPassword = () => {
        if (newPassword.current.value !== confirmPassword.current.value) {
            setRePasswordValid(false);
        } else {
            setRePasswordValid(true);
        }
    };

    const changePasswordHandler = (event) => {
        event.preventDefault();
        if ( passwordValid && newPasswordValid && rePasswordValid) {
            fetch(`${apiRoot.url}/${clientID}/password-update`, {
                method: 'PUT',
                body: JSON.stringify({ 
                    new_password: newPassword.current.value,
                    token: localStorage.getItem('token')
                })
            }).then(res => res.json())
            .then(result => console.log(result))
            .catch(err => console.log(err));

            fetch(`${apiRoot.url}/logout/${clientID}`, {method: 'PUT'})
            history.replace('/login');
            
        }
    };

    return(
        <Modal onClose={props.onClose}>
            <form onSubmit={changePasswordHandler}>
                <div className="form-group">
                    <input className="form-control" type="password" placeholder="Current password" ref={currentPassword} required onBlur={checkCurrentPassword}/>
                    {!passwordValid && <small>Wrong password.</small>}
                </div>
                <div className="form-group">
                    <input className="form-control" type="password" placeholder="New password" ref={newPassword} onBlur={checkNewPassword} required/>
                    {!newPasswordValid && <small>Password must be at least 8 characters and not be used before.</small>}
                </div>
                <div className="form-group">
                    <input className="form-control" type="password" placeholder="Confirm new password" ref={confirmPassword} onBlur={checkConfirmPassword} required/>
                    {!rePasswordValid && <small>Confirm password does not match.</small>}
                </div>
                <div className="change-pw-button">
                    <Button>Save change</Button>
                </div>
            </form>
        </Modal>
    )
};

export default ChangePasswordForm;