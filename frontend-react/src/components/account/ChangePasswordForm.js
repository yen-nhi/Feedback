import './ChangePasswordForm.css';
import Button from '../../UI/Button';
import Modal from '../../UI/Modal';
import { useRef, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import EndpointContext from '../../store/api-endpoint';
import { useDispatch } from 'react-redux';
import { clientActions } from '../../store/client';


const ChangePasswordForm = (props) => {
    const apiRoot = useContext(EndpointContext);
    const currentPassword = useRef();
    const newPassword = useRef();
    const confirmPassword = useRef();
    const [ newPasswordValid, setNewPasswordValid ] = useState(true);
    const [ rePasswordValid, setRePasswordValid ] = useState(true);
    const [ wrongPassword, setWrongPassword ] = useState(false);
    const dispatch = useDispatch();

    const history = useHistory();

    const header = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
    }

    const checkNewPassword = () => {
        if (newPassword.current.value.length < 8) {
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
        if (newPasswordValid && rePasswordValid) {
            fetch(`${apiRoot.url}/accounts/password`, {
                method: 'PUT',
                headers: header,
                body: JSON.stringify({ 
                    password: currentPassword.current.value,
                    new_password: newPassword.current.value,
                })
            }).then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.status === 'Fail') {
                    setWrongPassword(true);
                } else {
                    dispatch(clientActions.logout());
                    
                    history.replace('/login');
                }
            })
            .catch(err => console.log(err));
        }
    };

    return(
        <Modal onClose={props.onClose}>
            <form onSubmit={changePasswordHandler}>
                {wrongPassword && <small className='invalid'>Current password is wrong</small>}
                <div className="form-group">
                    <input className="form-control" type="password" placeholder="Current password" ref={currentPassword} required />
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