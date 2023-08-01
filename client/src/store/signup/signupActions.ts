
import {
    ForgotOpenAction,
    FORGOT_OPEN
} from '~/store/signup/signupActionTypes';

export function forgotOpen(): ForgotOpenAction {
    return {
        type: FORGOT_OPEN,
    };
}