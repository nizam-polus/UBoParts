// react
import React, { PropsWithChildren, useEffect, useState } from 'react';
// third-party
import classNames from 'classnames';
import { ToastContainer } from 'react-toastify';
// application
import Footer from '~/components/footer_/Footer';
import Header from '~/components/header/Header';
import MobileHeader from '~/components/mobile/MobileHeader';
import MobileMenu from '~/components/mobile/MobileMenu';
import Quickview from '~/components/shared/Quickview';
import { useOptions } from '~/store/options/optionsHooks';
import Forgotpass from './forgot/Forgotpass';
import Login from './account_/Login';
import Header_home from './header_/Header_home';
import { useRouter } from 'next/router';
interface Props extends PropsWithChildren<{}>{ }

function Layout(props: Props) {
    const { children } = props;
    const { desktopHeaderLayout, desktopHeaderScheme, mobileHeaderVariant } = useOptions();
    const desktopVariantClass = `${desktopHeaderLayout}-${desktopHeaderScheme}`;
    const mobileVariantClass = `mobile-${mobileHeaderVariant}`;

    const classes = classNames(
        'site',
        `site--desktop-header--${desktopVariantClass}`,
        `site--mobile-header--${mobileVariantClass}`,
    );
    const router = useRouter();
    const [userToken, setUserToken] = useState<any>('');

    useEffect(() => {
        const userdetails = localStorage.getItem('usertoken');
        setUserToken(userdetails);
    },[])

    
    const geUserDetails = () => {
        return localStorage.getItem('useruserdetails')
    }
    

    return (
        <div className={classes}>
            <ToastContainer 
                autoClose={5000} 
                hideProgressBar
                closeOnClick 
            />

            <div className="site__container">
                {/* <header className="site__mobile-header">
                    <MobileHeader />
                </header>

                <header className="site__header">
                    <Header />
                </header> */}
                <div className={router.pathname == '/homepage' ? 'home-header' : router.pathname == '/request' ? 'request-header' : 
                router.pathname == '/dismantle_car' ? 'dismantle-header' : router.pathname == '/about_us_' ? 'about-header' : 
                router.pathname == '/seller-registration' ? 'seller-reg-header' : 'page_header'}>
                    <Header_home userToken={userToken} geUserDetails={geUserDetails} />
                </div>

                <div className="site__body">
                    {children}
                </div>

                {<footer className="site__footer">
                    <Footer />
                </footer> }
            </div>

            <MobileMenu />

            <Quickview />
            <Forgotpass />
            <Login />
            
        </div>
    );
}

export default Layout;
