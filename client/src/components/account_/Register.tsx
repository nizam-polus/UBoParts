// react
import React, { useCallback, useEffect, useState } from 'react';
import { Modal } from 'reactstrap';
import axios from 'axios';
import { useRouter } from 'next/router';
// interface Props {  
//     isOpen?: boolean;
//     onClose?: () => void;
// }

function Register(props: any) {
    const router = useRouter();

    let isSubmitting = false;
    let hasError: any = {};

    const [errors, setErrors] = useState<any>({ });
  
    const validateValues = (inputValues: any) => {
        hasError = {};
        const regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        const isWhitespace = /^(?=.*\s)/;
        const isContainsUppercase = /^(?=.*[A-Z])/;
        const isContainsLowercase = /^(?=.*[a-z])/;
        const isContainsNumber = /^(?=.*[0-9])/;
        const isContainsSymbol = /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])/;
        const isValidLength = /^.{10,16}$/;

        if (inputValues.username.length === 0) {
            hasError.username = "username required";
            console.log(hasError.username);
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
            hasError.password = "Password must be 10-16 Characters Long.";
        } 
        if (inputValues.password !== inputValues.confirmpassword) {
            hasError.confirmpassword = "Passwords do not match";
        }
        isSubmitting = true;
    
        setErrors(hasError);
    };
    
    const [regformData, setRegFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmpassword: ''
    });

    const onRegFormDataChange = (event: any) => {
        event.preventDefault();

        setRegFormData({
            ...regformData,
            [event.target.name]: event.target.value
            
        });
        
    }
    
    const onFormSubmit = async (event: any) => {
        event.preventDefault();
        validateValues(regformData);
        console.log('Form data submitted:', regformData);
        try {
            if (Object.keys(hasError).length === 0 && isSubmitting === true) {
                const userdata = { 'username': regformData.username, 'email': regformData.email, 'password': regformData.password }
                await axios.post(`http://10.199.100.156:1337/api/auth/local/register`, { ...userdata })
                    .then((response: any) => {
                        localStorage.setItem('usertoken', JSON.stringify(response.data.jwt));
                        localStorage.setItem('userdetails', JSON.stringify(response.data.user));
                        // props.geUserDetails(response.data.jwt);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                const isEmpty = { username: "", email: "", password: "", confirmpassword: "" };
                setRegFormData(isEmpty);
                isSubmitting = false;
                console.log(errors);
                const currentPagePath = router.pathname;
                const targetPath = '/homepage';
                if (currentPagePath === targetPath) {
                    // Refresh the page
                    window.location.reload();
                } else {
                    // Redirect to the target path
                    router.push(targetPath);
                }
                // router.push(targetPath);
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

    const [forgotPasswordIsOpen, setForgotPasswordIsOpen] = useState(false);
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
                                <h3 className="ac-card-title text-center bg-image-text semifont">Register</h3>
                                <p className="ac-card-sub-title text-center body-sub-titles-1 lightfont">Let’s get you all setup so you can verify your personal account and begin setting up your profile</p>
                                <div className="acard-text">
                                    <form action="/action_page.php">
                                        <div className="form-group marginb40">
                                            <label htmlFor="text" className="body-sub-titles-1 mediumfont">Username</label>
                                            <input type="text" className="form-control body-sub-titles-1 mediumfont" id="name" name="username" placeholder="Enter your username" value={regformData.username} onChange={onRegFormDataChange}/>
                                            <p className="form_validerrors">{errors.username}</p>
                                        </div>
                                        <div className="form-group marginb40">
                                            <label htmlFor="email" className="body-sub-titles-1 mediumfont">Email address</label>
                                            <input type="email" className="form-control body-sub-titles-1 mediumfont" id="email" name="email" placeholder="Enter your email" value={regformData.email} onChange={onRegFormDataChange}/>
                                            <p className="form_validerrors">{errors.email}</p>
                                        </div>
                                        <div className="form-group marginb40">
                                                        <label htmlFor="password" className="body-sub-titles-1 mediumfont">Password</label>
                                                        <input type="password" className="form-control body-sub-titles-1 mediumfont" id="password" name="password" placeholder="Enter your password" value={regformData.password} onChange={onRegFormDataChange}/>
                                                        <p className="form_validerrors">{errors.password}</p>
                                                    </div>
                                        <div className="form-group marginb40">
                                                        <label htmlFor="password" className="body-sub-titles-1 mediumfont">Confirm password</label>
                                                        <input type="password" className="form-control body-sub-titles-1 mediumfont" id="confirmpassword" name="confirmpassword" placeholder="Confirm password" value={regformData.confirmpassword} onChange={onRegFormDataChange}/>
                                                        <p className="form_validerrors">{errors.confirmpassword}</p>
                                                    </div>
                                        <div className="form-group">
                                            <input type="checkbox" name="agree"/><span className="agree body-sub-titles-1 lightfont"><span>I agree to the </span><a href="" className="mediumfont">terms and conditions</a></span>
                                        </div>
                                        <button type="submit" className="btn btn-default body-sub-titles-1 mediumfont" onClick={(e) => onFormSubmit(e)}>Register</button>
                                    </form>
                                </div>
                                <div className="card-footer text-center">
                                    <p className="body-sub-titles-1 mediumfont"><span className="light">Already registered? </span><a href="">Login</a></p>
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
