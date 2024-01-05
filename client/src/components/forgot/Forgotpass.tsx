// react
import React, { useCallback, useEffect, useState } from 'react';
import { Modal } from 'reactstrap';
import { IVehicle } from '~/interfaces/vehicle';
import APIs from '~/services/apiService';
import { UserContext } from '../account_/UserContext';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';

interface Props {
    value?: IVehicle | null;
    isOpen?: boolean;
    onClose?: () => void;
    onSelect?: (vehicle: IVehicle | null) => void;
}

function Forgotpass(props: Props) {
   
    const { language } = UserContext();

    const {
        value = null,
        isOpen = false,
        onClose
    } = props;

    const [email, setEmail] = useState<string>('');
    
    const toggle = useCallback(() => {
        if (isOpen && onClose) {
            onClose();
        }
    }, [isOpen, onClose]);

    const handleReset = (event: any) => {
        event.preventDefault();
        APIs.forgotPassword({user_email_id: email, lang: language.value}).then(response => {
            toast.success(<FormattedMessage id="PASSWORD_RESET_EMAIL_SUCCESS" />);
            setEmail('')
        }).catch(err => {
            toast.error(<FormattedMessage id="SOMETHING_WRONG"/>)
        });
    }

    return (
        <Modal isOpen={isOpen} toggle={toggle} centered className="ac-modal">
            <div id="forgotmodal">
                <div className="ac-modal-content">
                    <div className="ac-modal-body">
                        <div className="ac-card login-form">
                            <div className="ac-card-body">
                                <h3 className="ac-card-title text-center"><FormattedMessage id="FORGET_PASSWORD"/></h3>
                                <p className="ac-card-sub-title text-center"><FormattedMessage id="ENTER_REGISTERD_EMAIL_TO"/> <br/> <FormattedMessage id="RESET_PASSWORD"/></p>
                                <div className="ac-card-text">
                                    <form action="/action_page.php">
                                        <div className="form-group">
                                            <label htmlFor="email"><FormattedMessage id="EMAIL_ADDRESS"/></label>
                                            <input type="email" 
                                                className="form-control" id="email" 
                                                placeholder="Enter your email" value={email}
                                                onChange={(e: any) => setEmail(e.target.value.toLowerCase())}
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-default mt-1"
                                            onClick={handleReset}
                                        ><FormattedMessage id="RESET_PASSWORD"/></button>
                                    </form>
                                </div>
                                <div className="ac-card-footer mt-2">
                                    <p className="body-sub-titles-1 mediumfont">
                                        <span className="lightfont"><FormattedMessage id="ALREADY_REGISTERED"/> </span>
                                        <button type="button" id="forgot_password" 
                                            className="body-sub-titles-1 mediumfont" 
                                            onClick={onClose}
                                        ><FormattedMessage id="LOGIN"/></button>
                                    </p>
                                </div>
                                {/* <div className="ac-card-footer text-center mt-2">
                                    <p>Already registered? <a onClick={onClose}>Login</a></p>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default Forgotpass;
