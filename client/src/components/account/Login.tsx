// react
import React, { useCallback, useEffect, useState } from 'react';
import { Modal } from 'reactstrap';
import Forgotpass from '../forgot/Forgotpass';

interface Props {  
    isOpen?: boolean;
    onClose?: () => void;
}

function Login(props: Props) {
   
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
        <Forgotpass
        
        isOpen={forgotPasswordIsOpen}
        onClose={onForgotPasswordClose}
       
        />
            <div id="loginmodal">
                <div className="ac-modal-content">
                    <div className="modal-body">
                        <div className="ac-card login-form">
                            <div className="ac-card-body">
                                <h3 className="ac-card-title text-center ac-heading_text semifont">Login</h3>
                                <p className="ac-card-sub-title text-center subtitles lightfont">Welcome back! Please enter your details</p>
                                <div className="ac-card-text">
                                    <form action="/action_page.php">
                                        <div className="form-group marginb40">
                                            <label htmlFor="email" className="subtitles mediumfont">Email address</label>
                                            <input type="email" className="form-control subtitles mediumfont inputformtxt" id="email" name="email" placeholder="Enter your email" />
                                        </div>
                                        <div className="form-group marginb40">
                                            <label htmlFor="password" className="subtitles mediumfont">Password</label>
                                            <input type="password" className="form-control subtitles mediumfont inputformtxt" id="password" name="password" placeholder="Enter your password" />                                            </div>
                                        <div className="form-group">
                                            <input type="checkbox" name="remember_me "/><span className="remember_me sub-subtext lightfont inputformtxt">Remember me</span>
                                            <button type="button" id="forgot_password" className="sub-subtext mediumfont" onClick={showForgotPassword}>Forgot Password</button>
                                        </div>
                                        <button type="submit" className="btn btn-default subtitles mediumfont">Login</button>
                                    </form>
                                </div>
                                <div className="ac-card-footer text-center">
                                    <p className="sub-subtext mediumfont"><span className="lightfont">Don't have an account? </span><a href="">Register Here</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          
        </Modal>
    );
}

export default Login;
