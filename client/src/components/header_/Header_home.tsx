// react
import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image'
import AppImage from '../shared/AppImage';
import Forgotpass from '../forgot/Forgotpass';
import Login from '../account/Login';

function Header_home() {
  
   
    const [forgotPasswordPickerIsOpen, setforgotPasswordPickerIsOpen] = useState(false);
   
    const showForgotPassword = () => {
        setforgotPasswordPickerIsOpen(true);
    };

    const onForgotPasswordClose = () => {
        setforgotPasswordPickerIsOpen(false);
    };
    
    const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
    const showLoginModal = () => {
        setLoginModalIsOpen(true);
    };

   const onLoginModalClose = () => {
        setLoginModalIsOpen(false);
    };
  
    return (
        <>
            <Forgotpass

                isOpen={forgotPasswordPickerIsOpen}
                onClose={onForgotPasswordClose}

            />
            <Login

                isOpen={loginModalIsOpen}
                onClose={onLoginModalClose}
            />
            <header className="home">
                <div className="container">
                    <div className="container-wrapper">
                        <div className="logo">
                            <AppImage src="/images/svg/LOGO.svg" />
                        </div>
                        <div className="bar w-100">
                            <ul>
                                <li className="menu_font_size regularfont"><a href="/homepage">Home</a></li>
                                <li className="menu_font_size regularfont"><a href="/shop">Shop</a></li>
                                <li className="menu_font_size regularfont"><a href="/about_us_">About us</a></li>
                                <li className="menu_font_size regularfont"><a href="/request">Request</a></li>
                                <li className="menu_font_size regularfont"><a href="">Dismantle Car</a></li>
                                <li className="menu_font_size regularfont"><button type="button" onClick={showLoginModal} className="ub_login">Login</button></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>
            
        </>
    );
}

export default Header_home;
