// react
import React, { useCallback, useEffect, useState } from 'react';
import { Modal } from 'reactstrap';
import axios from 'axios';
import { useRouter } from 'next/router';
import APIs from '~/services/apiService';
import { UserContext } from './UserContext';
import { FormattedMessage } from 'react-intl';
// interface Props {  
//     isOpen?: boolean;
//     onClose?: () => void;
// }

function Register(props: any) {
    const router = useRouter();
    const { language } = UserContext();
    
    let isSubmitting = false;
    let hasError: any = {};
    
    const [errors, setErrors] = useState<any>({ });
    const [forgotPasswordIsOpen, setForgotPasswordIsOpen] = useState(false);
    const [registered, setRegistered] = useState(false);
    const [regformData, setRegFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmpassword: ''
    });
    const [agreed, setAgreed] = useState(false);
    const [pwdVisible, setPwdVisible] = useState(false);
    const [confrmpwdVisible, setConfrmpwdVisible] = useState(false);
    
    const validateValues = (inputValues: any) => {
        hasError = {};
        const regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        const isWhitespace = /^(?=.*\s)/;
        const isContainsUppercase = /^(?=.*[A-Z])/;
        const isContainsLowercase = /^(?=.*[a-z])/;
        const isContainsNumber = /^(?=.*[0-9])/;
        const isContainsSymbol = /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])/;
        const isValidLength = /^.{8,16}$/;

        if (inputValues.username.length === 0) {
            hasError.username = "username required";
        }
        if (inputValues.email.length === 0) {
            hasError.email = "Email is required!";
        } else if (!regex.test(inputValues.email)) {
            hasError.email = "This is not a valid email format!";
        } 
        
        if (isWhitespace.test(inputValues.password)) {
            hasError.password = "Password must not contain Whitespaces.";
        } 
        if (!isContainsUppercase.test(inputValues.password)) {
            hasError.password = "Password must have at least one Uppercase Character.";
        } 
        if (!isContainsLowercase.test(inputValues.password)) {
            hasError.password = "Password must have at least one Lowercase Character.";
        }
        if (!isContainsNumber.test(inputValues.password)) {
            hasError.password = "Password must contain at least one Digit.";
        } 
        if (!isContainsSymbol.test(inputValues.password)) {
            hasError.password = "Password must contain at least one Special Symbol.";
        } 
        if (!isValidLength.test(inputValues.password)) {
            hasError.password = "Password must be 8-16 Characters Long.";
        } 
        if (inputValues.password !== inputValues.confirmpassword) {
            hasError.confirmpassword = "Passwords do not match";
        }
        if (!agreed) {
            hasError.agreement = "Agree to the terms and conditions";
        }
        isSubmitting = true;
    
        setErrors(hasError);
    };

    const onRegFormDataChange = (event: any) => {
        event.preventDefault();
        setRegFormData({
            ...regformData,
            [event.target.name]: event.target.value.toLowerCase()
        });
    };
    
    const onFormSubmit = async (event: any) => {
        event.preventDefault();
        validateValues(regformData);
        console.log(agreed)
        try {
            if (Object.keys(hasError).length === 0 && isSubmitting && agreed) {
                const userdata = { 
                    username: regformData.username, 
                    email: regformData.email, 
                    password: regformData.password, 
                    user_type : 'normal', 
                    isApproved : 'Active',
                    agreed: agreed,
                    verified: false,
                    lang: language.value
                }
                APIs.register(userdata).then((response: any) => {
                    let userData = response.data.user;
                    setRegistered(true);
                    // localStorage.setItem('usertoken', JSON.stringify(response.data.jwt));
                    // localStorage.setItem('userdetails', JSON.stringify(userData));
                    const isEmpty = { username: "", email: "", password: "", confirmpassword: "" };
                    setRegFormData(isEmpty);
                    setTimeout(() => {
                        setRegistered(false);
                        // saveUser(userData);
                        onClose();
                    }, 4000)
                    isSubmitting = false;
                    router.push('/homepage');
                })
                .catch((error) => {
                    setErrors(error?.response?.data?.error);
                    console.log('error', error);
                });
          }
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

   
    const {
        isOpen = false,
        onClose, 
    } = props;
    
    const toggle = useCallback(() => {
        if (isOpen && onClose) {
            onClose();
        }
    }, [isOpen, onClose]);

    useEffect(() => { 
        if (isOpen) {
            
        }
    }, [isOpen]);

    const showForgotPassword = () => {
        setForgotPasswordIsOpen(true);
    };

    const onForgotPasswordClose = () => {
        setForgotPasswordIsOpen(false);
    };

    const showForgotAndCloseLogin = () => {
        setForgotPasswordIsOpen(true);  
    };


    return (
        <Modal isOpen={isOpen} toggle={toggle} centered className="ac-modal">
            <div id="loginmodal">
                <div className="ac-modal-content">
                    <div className="modal-body">
                        <div className="ac-card login-form">
                            <div className="card-body">
                                <h3 className="ac-card-title text-center bg-image-text semifont"><FormattedMessage id="REGISTER"/></h3>
                                <p className="ac-card-sub-title text-center body-sub-titles-1 lightfont"
                                    ><FormattedMessage id="REGISTER_DETAILS"/></p>
                                <div className="acard-text">
                                    <form action="/action_page.php">
                                        <div className="form-group marginb40">
                                            <label htmlFor="text" className="body-sub-titles-1 mediumfont"><FormattedMessage id="USER_NAME"/></label>
                                            <input type="text" 
                                                className="form-control body-sub-titles-1 mediumfont" 
                                                id="name" name="username" placeholder="Enter your username" 
                                                value={regformData.username} onChange={onRegFormDataChange}
                                            />
                                            <p className="form_validerrors">{errors?.username}</p>
                                        </div>
                                        <div className="form-group marginb40">
                                            <label htmlFor="email" className="body-sub-titles-1 mediumfont"><FormattedMessage id="EMAIL_ADDRESS"/></label>
                                            <input type="email" 
                                                className="form-control body-sub-titles-1 mediumfont" 
                                                id="email" name="email" placeholder="Enter your email" 
                                                value={regformData.email} onChange={onRegFormDataChange}
                                            />
                                            <p className="form_validerrors">{errors?.email}</p>
                                        </div>
                                        <div className="form-group marginb40">
                                                        <label htmlFor="password" className="body-sub-titles-1 mediumfont"><FormattedMessage id="PASSWORD"/></label>
                                                        <div className="position-relative">
                                                        <input type={pwdVisible ? "text" : "password"} 
                                                            className="form-control body-sub-titles-1 mediumfont" 
                                                            id="password" name="password" placeholder="Enter your password" 
                                                            value={regformData.password} onChange={onRegFormDataChange}
                                                        />
                                                        <div className="position-absolute p-3" style={{right: 0, top: 0}}>
                                                        <span
                                                                className="password-visibility-toggle"
                                                                onClick={() => setPwdVisible(!pwdVisible)}
                                                            >
                                                                {pwdVisible ? (
                                                                    <i className="far fa-eye"></i>
                                                                    ) : (
                                                                    <i className="far fa-eye-slash"></i>
                                                                )}
                                                            </span>
                                                        </div>
                                                        </div>
                                                        <p className="form_validerrors">{errors?.password}</p>
                                                    </div>
                                        <div className="form-group marginb40">
                                                        <label htmlFor="password" className="body-sub-titles-1 mediumfont"><FormattedMessage id="CONFIRM_PASSWORD"/></label>
                                                        <div className="position-relative">

                                                        <input type={confrmpwdVisible ? "text" : "password"}
                                                            className="form-control body-sub-titles-1 mediumfont" 
                                                            id="confirmpassword" name="confirmpassword" placeholder="Confirm password" 
                                                            value={regformData.confirmpassword} onChange={onRegFormDataChange}
                                                        />
                                                        <div className='position-absolute p-3' style={{right: 0, top: 0}}>
                                                            <span
                                                                className="password-visibility-toggle"
                                                                onClick={() => setConfrmpwdVisible(!confrmpwdVisible)}
                                                            >
                                                                {confrmpwdVisible ? (
                                                                    <i className="far fa-eye"></i>
                                                                    ) : (
                                                                    <i className="far fa-eye-slash"></i>
                                                                )}
                                                            </span>
                                                            </div>
                                                        </div>
                                                        <p className="form_validerrors">{errors?.confirmpassword}</p>
                                                    </div>
                                        <div className="form-group">
                                            <input type="checkbox" name="agree" 
                                                onClick={(e: any) => {
                                                    setAgreed(!agreed);
                                                }}
                                            />
                                                <span className="agree body-sub-titles-1 lightfont">
                                                    <span><FormattedMessage id="AGREE_TO_THE"/> </span>
                                                    <a href="" className="mediumfont"> <FormattedMessage id="TERMS_AND_CONDITION"/></a>
                                                </span>
                                        </div>
                                        {!agreed && <span className="form_validerrors">{errors?.agreement}</span>}
                                        {errors?.status === 400 && <p className='text-center' style={{color: 'rgb(255 102 102)'}}>{errors?.message}</p>}
                                        {registered && 
                                            <>
                                                <p className='text-center mb-0' style={{color: 'rgb(25, 135, 84)'}}>Verification mail has been sent to your email.</p>
                                                <p className='text-center' style={{color: 'rgb(25, 135, 84)'}}>Please verify your email!</p>
                                            </>
                                        }
                                        <button type="submit" className="btn btn-default body-sub-titles-1 mediumfont" onClick={(e) => onFormSubmit(e)}><FormattedMessage id="REGISTER"/></button>
                                    </form>
                                </div>
                                <div className="card-footer text-center">
                                    <p className="body-sub-titles-1 mediumfont"><span className="light"><FormattedMessage id="ALREADY_REGISTERED"/> </span><a className='pointer' onClick={() => onClose()}> <FormattedMessage id="LOGIN"/></a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          
        </Modal>
    );
}

export default Register;
