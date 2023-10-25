// react
import Link from 'next/link';
import AppImage from '../shared/AppImage';
import { useState } from 'react';
import Login from '../account_/Login';
import Register from '../account_/Register';

function Footer() {

    const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
    const [registerIsOpen, setRegisterIsOpen] = useState<boolean>(false);
    const [loginmodal, setLoginModal] = useState<boolean>(true);

    const onLoginModalClose = () => {
        setLoginModalIsOpen(false);
    };

    const geUserDetails = () => {
        return localStorage.getItem('useruserdetails')
    }

    const showLoginModal = () => {
        setLoginModalIsOpen(true);
    };

    const onRegisterClose = () => {
        setRegisterIsOpen(false);
        setLoginModal(true); 
    };

    const showRegister = () => {
        setRegisterIsOpen(true);
        setLoginModal(false);
    };
    return (
        <>
            <footer className="bg-color-1 p-5">
                <div className="container-fluid">
                    <div className="container">
                        <div className="row g-5">
                            <div className="col">
                                <p className="boldfontsize regularfont text-white">Contact Us</p>
                                <div className="row">
                                    <div className="col">
                                        <p className="regularfont short-labels label-color-1 mb-1">Phone Number</p>
                                        <p className="text-white regularfont short-labels-1 mb-3">+31 6 33490782</p>
                                        <p className="regularfont short-labels label-color-1 mb-1">Working Hours</p>
                                        <p className="text-white regularfont short-labels-1 mb-3">Monday - Friday<br/> 
                                            08:00 - 17:00</p>
                                    </div>
                                    <div className="col">
                                        <p className="regularfont short-labels label-color-1 mb-1">Email Address</p>
                                        <p className="text-white regularfont short-labels-1 mb-3">Info@uboparts.com</p>
                                        <p className="regularfont short-labels label-color-1 mb-1">Our Location</p>
                                        <p className="text-white regularfont short-labels-1 mb-3">UBO Parts,<br/> 
                                            Zomerdijk 11, 1505HW<br/> Zaandam, The Netherlands</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-auto">
                                <p className="boldfontsize regularfont text-white">Information</p>
                                <p className="regularfont short-labels-1 label-color-1 mb-2">
                                    <Link  href="/about_us_">
                                        About Us
                                    </Link>
                                </p>
                                <p className="regularfont short-labels-1 label-color-1 mb-2">
                                    <Link href="/terms-and-conditions">
                                        Terms & Conditions
                                    </Link>
                                </p>
                                <p className="regularfont short-labels-1 label-color-1 mb-2">
                                    <Link href="/privacy-policy">
                                        Privacy Policy
                                    </Link>
                                </p>
                                <p className="regularfont short-labels-1 label-color-1 mb-2">
                                    <Link href="https://uboparts.com/home/contactus">
                                        Contact Us
                                    </Link>
                                </p>
                                <p className="regularfont short-labels-1 label-color-1 mb-2">
                                    <Link href="/advertise-with-us">
                                        Advertise with us
                                    </Link>
                                </p>
                                <p className="regularfont short-labels-1 label-color-1 mb-2">
                                    <Link href="/cookies">
                                        Cookies
                                    </Link>
                                </p>
                            </div>
                            <div className="col-auto">
                                <p className="boldfontsize regularfont text-white">Useful Links</p>
                                <p className="regularfont short-labels-1 label-color-1 mb-2">
                                    <Link href="/seller-registration">
                                        Start selling with us
                                    </Link>
                                </p>
                                <p onClick={showRegister} className="regularfont short-labels-1 label-color-1 mb-2">       
                                        Register as a customer                  
                                </p>
                                <p onClick={showLoginModal} className="regularfont short-labels-1 label-color-1 mb-2">                                                                 
                                        Login
                                </p>
                            </div>
                            <div className="col">
                                <p className="boldfontsize regularfont text-white">Newsletter</p>
                                <p className="regularfont short-labels-1 label-color-1 mb-2">Enter your email address to subscribe to our newsletter and keep up to date with discounts and special offers.</p>
                                <form className="newsletter-signup">
                                    <div className="row g-2 mb-2">
                                        <div className="col-12 col-sm-6">
                                            <input type="email" className=" lightfont form-control h-auto input-bg-color-1 text-white footer-placeholder-font-size rounded-lg border-0" placeholder="Email Address..." name="email"/>
                                        </div>
                                        <div className="col-12 col-sm-6 pl-sm-0">
                                            <button type="submit" className="btn regularfont button-bg-color-1 text-white border-0 rounded-lg ubo-btn-subscribe">Subscribe</button>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <p className="regularfont short-labels-1 label-color-1 mb-2 w-100 px-3 ">Follow us on social networks</p>
                                        <div className="col">
                                            <a href=""><AppImage src="images/instagram.svg"/></a>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            <Login
                isOpen={loginModalIsOpen}
                onClose={onLoginModalClose}
                geUserDetails={geUserDetails}
            />
            <Register
                isOpen={registerIsOpen}
                onClose={onRegisterClose}
                geUserDetails={geUserDetails}
            />
        </>
    );
}

export default Footer;
