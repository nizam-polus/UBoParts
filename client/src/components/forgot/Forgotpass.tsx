// react
import React, { useCallback, useEffect, useState } from 'react';
import { Modal } from 'reactstrap';
import { IVehicle } from '~/interfaces/vehicle';

interface Props {
    value?: IVehicle | null;
    isOpen?: boolean;
    onClose?: () => void;
    onSelect?: (vehicle: IVehicle | null) => void;
}

function Forgotpass(props: Props) {
   
    const {
        value = null,
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
    }, [isOpen, value]);

    return (
        <Modal isOpen={isOpen} toggle={toggle} centered className="vehicle-picker-modal">
            <div id="forgotmodal">
                <div className="ac-modal-content">
                    <div className="ac-modal-body">
                        <div className="ac-card login-form">
                            <div className="ac-card-body">
                                <h3 className="ac-card-title text-center">Forget Password</h3>
                                <p className="ac-card-sub-title text-center">Enter registered email to <br/>reset your password</p>
                                <div className="ac-card-text">
                                    <form action="/action_page.php">
                                        <div className="form-group">
                                            <label htmlFor="email">Email address</label>
                                            <input type="email" className="form-control" id="email" placeholder="Enter your email" />
                                        </div>
                                        <button type="submit" className="btn btn-default">Reset Password</button>
                                    </form>
                                </div>
                                <div className="ac-card-footer text-center">
                                    <p>Already registered? <a href="">Login</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default Forgotpass;
