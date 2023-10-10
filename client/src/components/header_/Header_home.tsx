// react
import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image'
import AppImage from '../shared/AppImage';
import Forgotpass from '../forgot/Forgotpass';
import Login from '../account_/Login';
import { useRouter } from 'next/router';
import Link from 'next/dist/client/link';
import APIs from '~/services/apiService';
import { UserContext } from '../account_/UserContext';
import { BASE_URL } from 'configuration';


function Header_home(props: any) {
  
    const router = useRouter();
    const {user, saveUser, cartCount} = UserContext();
    const [userToken, setUserToken] = useState<any>();

    useEffect(() => {
        const tokendata = localStorage.getItem('usertoken');
        setUserToken(tokendata);  
    },[userToken]);

    useEffect(() => {
        setLoginModalIsOpen(false);
        const tokendata: any = localStorage.getItem('usertoken');
        setUserToken(tokendata);
    }, [user]);
    
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
        router.push('/homepage');
        localStorage.removeItem('userdetails');
        setUserToken('');
        setIsLoggedin(false);
        setIsOpen(!isOpen);
        saveUser({});
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
                                <li className="menu_font_size regularfont" onClick={() =>setIsOpen(false)}><Link href="/homepage">Home</Link></li>
                                <li className="menu_font_size regularfont" onClick={() =>setIsOpen(false)}><Link href="/shop">Shop</Link></li>
                                <li className="menu_font_size regularfont" onClick={() =>setIsOpen(false)}><Link href="/about_us_">About us</Link></li>
                                <li className="menu_font_size regularfont" onClick={() =>setIsOpen(false)}><Link href="/request">Request</Link></li>
                                <li className="menu_font_size regularfont" onClick={() =>setIsOpen(false)}><Link href="/dismantle_car">Dismantle Car</Link></li>
                                {!userToken && <li className="menu_font_size regularfont" onClick={() =>setIsOpen(false)}><Link href="/seller-registration">Start Selling</Link></li>}
                                {!userToken && <li className="menu_font_size regularfont"><button type="button" onClick={showLoginModal} className="ub_login">Login</button></li>}
                                {/*props.userToken && <li className="menu_font_size regularfont"> 
                                <a href=""><AppImage src="/images/svg/my-account.svg" className="my-account"/></a></li>*/}
                            </ul>
                        </div>
                        {userToken && 
                            <div className="bar w-27 d-flex flex-row">
                                <div>
                                    <button className="btn border-0 menu_font_size regularfont menu-color" onClick={() => setIsOpen(!isOpen)}>My Account</button>
                                    {isOpen && (
                                        <div className='position-absolute menu-dropdown account-dropdown'>
                                            <div className='dropdownitem'>
                                                <span className='menu_font_size regularfont pointer' 
                                                    onClick={() => {
                                                        let route = (user.isApproved === 'Active' && user.role.type === 'seller') ? '/seller/dashboard' : '/purchase-history';
                                                        router.push(route);
                                                        setIsOpen(!isOpen);
                                                    }}
                                                >Dashboard</span>
                                            </div>
                                            <div className='dropdownitem'>
                                                <span className='menu_font_size regularfont pointer' 
                                                    onClick={() => {
                                                        router.push('/profile_');
                                                        setIsOpen(!isOpen);
                                                    }}
                                                >Profile</span>
                                            </div>
                                            <div className='dropdownitem'>
                                                <span className='menu_font_size regularfont pointer' 
                                                    style={{zIndex: 2, position: 'relative'}} 
                                                    onClick={logout}
                                                >Logout</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <span className='ml-2' onClick={() =>setIsOpen(false)} style={{borderRadius: '100%'}}>
                                    <AppImage src={user?.profile_image?.url ? BASE_URL + user?.profile_image?.url : "/images/svg/my-account.svg"} 
                                        style={{height: '2.4rem', width: '2.4rem', objectFit: 'cover', borderRadius: '100%'}}
                                    />
                                </span>
                                <li className='mt-1 pointer' 
                                    onClick={() =>setIsOpen(false)}
                                >
                                    <Link href="/cartpage">
                                        <span>
                                            <AppImage src="/images/cart-white.svg"/>
                                            <span className="home_count">{cartCount}</span>
                                        </span>
                                    </Link>
                                </li>
                            </div>   
                        }  
                    </div>
                </div>
                {router.pathname == '/request' && <div className="container">
                    <div className="row d-flex align-items-center header-middle-text pl-5">
                        <div className="col box w-100">
                            <p className="semifont heading_text text-white">Request Parts<br /> With Us</p>
                            <p className="lightfont sub-text-1 text-white">Browse our expansive selection<br /> featuring hundreds of brands and<br /> tens of thousands of quality parts.</p>
                        </div>
                    </div>
                </div>}
                {router.pathname == '/dismantle_car' && <div className="container">
                    <div className="row d-flex align-items-center header-middle-text pl-5 ml-5">
                        <div className="col box w-100">
                            <p className="semifont heading_text text-white">Dismantle your<br /> car with us</p>
                            <p className="lightfont sub-text-1 text-white">Browse our expansive selection<br /> featuring hundreds of brands and<br /> tens of thousands of quality parts.</p>
                        </div>
                    </div>
                </div>}
                {router.pathname == '/seller-registration' && <div className="container">
                    <div className="row d-flex align-items-center header-middle-text pl-5 ml-5">
                        <div className="col box w-100">
                            <p className="semifont heading_text text-white">Dismantle your<br /> car with us</p>
                            <p className="lightfont sub-text-1 text-white">Browse our expansive selection<br /> featuring hundreds of brands and<br /> tens of thousands of quality parts.</p>
                        </div>
                    </div>
                </div>}
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
