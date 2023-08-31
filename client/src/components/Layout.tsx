// react
import React, { PropsWithChildren } from 'react';
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
