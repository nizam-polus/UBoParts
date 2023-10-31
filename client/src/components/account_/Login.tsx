// react
import React, { useCallback, useEffect, useState } from 'react';
import { Modal } from 'reactstrap';
import Forgotpass from '../forgot/Forgotpass';
import Register from './Register'
import axios from 'axios';
import { useRouter } from 'next/router';
import APIs from '~/services/apiService';
import { UserContext } from './UserContext';
import { FormattedMessage } from 'react-intl';
// interface Props {
//     isOpen?: boolean;
//     onClose?: () => void;
//     geUserDetails: 
// }

function Login(props: any) {

    const router = useRouter();
    const {user, saveUser} = UserContext();
    
    const [loginformData, setLoginFormData] = useState({
        username: props.username || '',
        password: ''
    });
    const [loginmodal, setLoginModal] = useState<boolean>(true);
    const [forgotPasswordIsOpen, setForgotPasswordIsOpen] = useState<boolean>(false);
    const [registerIsOpen, setRegisterIsOpen] = useState<boolean>(false);
    const [invalidinput, setInvalidInput] = useState<boolean>(false);
    const [invalidCred, setInvalidCred] = useState<boolean>(false);
    const [unverified, setUnverified] = useState<boolean>(false);
    const [rememberMe, setRememberMe] = useState<boolean>(false);

    const onLoginFormDataChange = (event: any) => {
        event.preventDefault();
        setLoginFormData({
            ...loginformData,
            [event.target.name]: event.target.value 
        });
    }

    const onFormSubmit = async (event: any) => {
        event.preventDefault();
        let loginDate = new Date().toISOString().split('T').join(' ').split('.')[0];
        let expiryDate: any;
        if (rememberMe) {
            expiryDate = new Date().setDate(new Date().getDate() + 7);
            expiryDate = new Date(expiryDate).toISOString().split('T').join(' ').split('.')[0];
        } else {
            expiryDate = new Date().setDate(new Date().getDate() + 1);
            expiryDate = new Date(expiryDate).toISOString().split('T').join(' ').split('.')[0];
        }
        try {
            if (loginformData.username && loginformData.password) {
                setInvalidCred(false);
                setInvalidInput(false);
                const userdata = {...{ identifier: loginformData.username, password: loginformData.password }}
                APIs.auth(userdata).then((response: any) => {
                    if (response.data.error && response.data.error.status >= 400 && response.data.error.status <= 403) {
                        setInvalidCred(true);
                    } else if (response.data.user.verification !== 'true') {
                        setUnverified(true);
                    } else {
                        let userdetails = response.data.user;
                        setUnverified(false);
                        localStorage.setItem('usertoken', JSON.stringify(response.data.jwt));
                        APIs.getSpecificUser(userdetails.id).then((response: any) => {
                            let loginData = {
                                login_date: loginDate,
                                expiry_date: expiryDate
                            }
                            APIs.updateSpecificUser(userdetails.id, loginData).then((userRes: any) => {
                                let userData = userRes.data;
                                localStorage.setItem('userdetails', JSON.stringify(userData));
                                saveUser(userData);
                                if(userRes.data.role.type == "admin"){
                                    router.push('/admin_create')
                                } else if (props.username) {
                                    router.push('/profile_');
                                } else {
                                    router.push('/homepage');
                                }
                                onClose();
                                const isEmpty = { username: "", password: ""};
                                setLoginFormData(isEmpty);
                            })
                        })
                    }
                })
                .catch((error) => {
                    setInvalidCred(true)
                    console.log('error ', error);
                });
            } else {
                setInvalidInput(true)
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const {
        isOpen = false,
        onClose,
    } = props;

    const toggle = useCallback(() => {
        if (isOpen && onClose) {
            onClose();
            setInvalidCred(false);
            setInvalidInput(false);
        }
    }, [isOpen, onClose]);

    const showForgotPassword = () => {
        setForgotPasswordIsOpen(true);
        setLoginModal(false);
    };

    const onForgotPasswordClose = () => {
        setForgotPasswordIsOpen(false);
        setLoginModal(true);
    };

    const showRegister = () => {
        setRegisterIsOpen(true);
        setLoginModal(false);
    };

    const onRegisterClose = () => {
        setRegisterIsOpen(false);
        setLoginModal(true); 
    };

    return (
        <>  
            <Forgotpass
                isOpen={forgotPasswordIsOpen}
                onClose={onForgotPasswordClose}
            />
            <Register
                isOpen={registerIsOpen}
                onClose={onRegisterClose}
                geUserDetails={props.geUserDetails}
            />
            {loginmodal &&
                <Modal isOpen={isOpen} toggle={toggle} centered className="ac-modal">
                    <div id="loginmodal">
                        <div className="ac-modal-content">
                            <div className="modal-body">
                                <div className="ac-card login-form">
                                    <div className="ac-card-body">
                                        <h3 className="ac-card-title text-center bg-image-text semifont"><FormattedMessage id="LOGIN" /></h3>
                                        <p className="ac-card-sub-title text-center body-sub-titles-1 lightfont"><FormattedMessage id="LOGIN_DETAILS" /></p>
                                        {invalidinput ? <p className='text-center' style={{color: 'rgb(255 102 102)'}}>Please enter your email & password</p> : invalidCred ? 
                                            <p className='text-center' style={{color: 'rgb(255 102 102)'}}>Invalid credentials</p> :  unverified ?
                                            <p className='text-center' style={{color: 'rgb(255 102 102)'}}>User not verified. Please verify the user.</p> : undefined}
                                        <div className="ac-card-text">
                                            <form action="/action_page.php">
                                                <div className="form-group marginb40">
                                                    <label htmlFor="email" className="body-sub-titles-1 mediumfont"><FormattedMessage id="USERNAME_OR_EMAIL" /></label>
                                                    <input type="email" 
                                                        className="form-control body-sub-titles-1 mediumfont inputformtxt" 
                                                        id="email" name="username" 
                                                        placeholder="Enter your email" 
                                                        value={loginformData.username} 
                                                        onChange={onLoginFormDataChange}
                                                    />
                                                </div>
                                                <div className="form-group marginb40">
                                                    <label htmlFor="password" className="body-sub-titles-1 mediumfont"><FormattedMessage id="PASSWORD"/></label>
                                                    <input type="password" 
                                                        className="form-control body-sub-titles-1 mediumfont inputformtxt" 
                                                        id="password" name="password" 
                                                        placeholder="Enter your password" 
                                                        value={loginformData.password} 
                                                        onChange={onLoginFormDataChange}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <input type="checkbox" name="remember_me" 
                                                        className='rounded' onClick={() => setRememberMe(!rememberMe)}
                                                    />
                                                    <span className="remember_me body-sub-titles-1 lightfont inputformtxt"><FormattedMessage id="REMEMBER_ME"/></span>
                                                    <button type="button" id="forgot_password" 
                                                        className="body-sub-titles-1 mediumfont" 
                                                        onClick={showForgotPassword}
                                                    ><FormattedMessage id="FORGOT_PASSWORD"/></button>
                                                </div>
                                                <button type="submit" className="btn btn-default body-sub-titles-1 mediumfont" onClick={(e) => onFormSubmit(e)}>Login</button>
                                            </form>
                                        </div>
                                        <div className="ac-card-footer mt-2">
                                            <p className="body-sub-titles-1 mediumfont">
                                                <span className="lightfont"><FormattedMessage id="DONT_HAVE_AN_ACCOUNT"/> </span>
                                                <button type="button" id="forgot_password" 
                                                    className="body-sub-titles-1 mediumfont" 
                                                    onClick={showRegister}
                                                ><FormattedMessage id="REGISTER"/></button>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            }
        </>
    );
}

export default Login;
