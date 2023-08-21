// react
import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image'
import AppImage from '../shared/AppImage';
import Forgotpass from '../forgot/Forgotpass';
import Login from '../account_/Login';
import { useRouter } from 'next/router';



function Header_home(props: any) {
  
    const router = useRouter();
    const [userToken, setUserToken] = useState<any>();
    useEffect(() => {
        const tokendata = localStorage.getItem('usertoken');
        setUserToken(tokendata);  
    },[userToken])
    
    const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
    const [profiledropdown, setProfiledropdown] = useState(false);
    const showLoginModal = () => {
        setLoginModalIsOpen(true);
    };

   const onLoginModalClose = () => {
        setLoginModalIsOpen(false);
    };

    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedin, setIsLoggedin] = useState(true);

    const logout = () => {
        localStorage.removeItem('usertoken');
        localStorage.removeItem('userdetails');
        setUserToken('');
       
        setIsLoggedin(false);
        router.push('/homepage');
    };
  
    return (
        <>
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
                                <li className="menu_font_size regularfont"><a href="/dismantle_car">Dismantle Car</a></li>
                                {!userToken && <li className="menu_font_size regularfont"><button type="button" onClick={showLoginModal} className="ub_login">Login</button></li>}
                                {/*props.userToken && <li className="menu_font_size regularfont"> 
                                <a href=""><AppImage src="/images/svg/my-account.svg" className="my-account"/></a></li>*/}
                            </ul>
                        </div>
                        {userToken && <div className="bar w-27 d-flex flex-row">
                            <div>
                                <button className="btn border-0 menu_font_size regularfont menu-color" onClick={() => setIsOpen(!isOpen)}>My Account</button>
                                {isOpen && (
                                    <div className='position-absolute menu-dropdown'>
                                        <div className='dropdownitem'><a className='menu_font_size regularfont'>Profile</a></div>
                                        <div className='dropdownitem'><a className='menu_font_size regularfont' onClick={logout}>Logout</a></div>
                                    </div>
                                )}
                            </div>
                            <a href=""><AppImage src="/images/svg/my-account.svg" className="my-account"/></a>
                            <li><AppImage src="/images/svg/cart-white.svg"/><span className="count">0</span></li>
                        </div>   }  
                    </div>
                </div>
            </header>
            {(!userToken || userToken == '') &&
            <Login
                isOpen={loginModalIsOpen}
                onClose={onLoginModalClose}
                geUserDetails={props.geUserDetails}
            />
        }
        </>
    );
}

export default Header_home;
