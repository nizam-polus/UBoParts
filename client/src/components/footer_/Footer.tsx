// react
import Link from 'next/link';
import AppImage from '../shared/AppImage';
import { useState } from 'react';
import Login from '../account_/Login';
import Register from '../account_/Register';
import { FormattedMessage } from 'react-intl';
import APIs from '~/services/apiService';
import { toast } from 'react-toastify';

function Footer() {

    const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
    const [registerIsOpen, setRegisterIsOpen] = useState<boolean>(false);
    const [loginmodal, setLoginModal] = useState<boolean>(true);
    const [email, setEmail] = useState<string>('');

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

    const handleSubscribe = (event: any) => {
        event.preventDefault();
        APIs.newsletter(email)
        .then(() => toast.success('Your subscription is registered.'))
        .catch(err => {
            console.log(err);
            toast.error('Something went wrong!');
        })
    }

    return (
        <>
            <footer className="bg-color-1 p-5">
                <div className="container-fluid">
                    <div className="container">
                        <div className="row g-5">
                            <div className="col">
                                <p className="boldfontsize regularfont text-white"><FormattedMessage id="CONTACT_US" /></p>
                                <div className="row">
                                    <div className="col">
                                        <p className="regularfont short-labels label-color-1 mb-1"><FormattedMessage id="PHONE_NO" /></p>
                                        <p className="text-white regularfont short-labels-1 mb-3">+31 6 33490782</p>
                                        <p className="regularfont short-labels label-color-1 mb-1"><FormattedMessage id="WORKING_HOURS" /></p>
                                        <p className="text-white regularfont short-labels-1 mb-3"><FormattedMessage id="MONDAY_TO_FRIDAY" /><br/> 
                                            08:00 - 17:00</p>
                                    </div>
                                    <div className="col">
                                        <p className="regularfont short-labels label-color-1 mb-1"><FormattedMessage id="OUR_LOCATION" /></p>
                                        <p className="text-white regularfont short-labels-1 mb-3">Info@uboparts.com</p>
                                        <p className="regularfont short-labels label-color-1 mb-1">Our Location</p>
                                        <p className="text-white regularfont short-labels-1 mb-3">UBO Parts,<br/> 
                                            Zomerdijk 11, 1505HW<br/> Zaandam, The Netherlands</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-auto footer-link-section">
                                <p className="boldfontsize regularfont text-white"><FormattedMessage id="INFORMATION" /></p>
                                <p className="regularfont short-labels-1 label-color-1 mb-2">
                                    <Link  href="/about_us_">
                                        <span className='pointer'><FormattedMessage id="ABOUT_US"/></span>
                                    </Link>
                                </p>
                                <p className="regularfont short-labels-1 label-color-1 mb-2">
                                    <Link href="/cookie">
                                    <span className='pointer'><FormattedMessage id="TERMS_CONDITIONS"/></span>
                                    </Link>
                                </p>
                                <p className="regularfont short-labels-1 label-color-1 mb-2">
                                    <Link href="/cookie">
                                    <span className='pointer'><FormattedMessage id="PRIVACY_POLICY"/></span>
                                    </Link>
                                </p>
                                <p className="regularfont short-labels-1 label-color-1 mb-2">
                                    <Link href="/contact_us">
                                    <span className='pointer'><FormattedMessage id="CONTACT_US"/></span>
                                    </Link>
                                </p>
                                <p className="regularfont short-labels-1 label-color-1 mb-2">
                                    <Link href="/advertise-with-us">
                                    <span className='pointer'><FormattedMessage id="ADS_WITH_US"/></span>
                                    </Link>
                                </p>
                                <p className="regularfont short-labels-1 label-color-1 mb-2">
                                    <Link href="/cookie">
                                    <span className='pointer'><FormattedMessage id="COOKIES"/></span>
                                    </Link>
                                </p>
                            </div>
                            <div className="col-auto footer-link-section">
                                <p className="boldfontsize regularfont text-white"><FormattedMessage id="USEFULL_LINKS" /></p>
                                <p className="regularfont short-labels-1 label-color-1 mb-2">
                                    <Link href="/seller-registration">
                                        <span className='pointer'><FormattedMessage id="START_SELLING"/></span>
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
                                <p className="boldfontsize regularfont text-white"><FormattedMessage id="NEWS_LETTER" /></p>
                                <p className="regularfont short-labels-1 label-color-1 mb-2"><FormattedMessage id="NEWSLETTER_DETAILS"/></p>
                                <form className="newsletter-signup">
                                    <div className="row g-2 mb-2">
                                        <div className="col-12 col-sm-9">
                                            <input type="email" 
                                                className=" lightfont form-control h-auto input-bg-color-1 text-white footer-placeholder-font-size rounded-lg border-0" 
                                                placeholder="Email Address..." name="email" value={email}
                                                onChange={(e: any) => setEmail(e.target.value.toLowerCase())}
                                            />
                                        </div>
                                        <div className="col-12 col-sm-3 pl-sm-0">
                                            <button type="submit" 
                                                className="btn regularfont button-bg-color-1 text-white border-0 rounded-lg ubo-btn-subscribe"
                                                onClick={handleSubscribe}
                                            ><FormattedMessage id="SUBSCRIBE"/></button>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <p className="regularfont short-labels-1 label-color-1 mb-2 w-100 px-3 "><FormattedMessage id="FOLLOW_US"/></p>
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
