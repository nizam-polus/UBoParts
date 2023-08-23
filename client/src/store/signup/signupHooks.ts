// application
//import { QUICKVIEW_NAMESPACE } from '~/store/quickview/quickviewReducer';
//import { forgotOpen } from '~/store/signup/signupActions';
import { useAppAction, useAppSelector } from '~/store/hooks';
import { forgotOpen } from './signupActions';

//export const useQuickview = () => useAppSelector((state) => state[QUICKVIEW_NAMESPACE]);

export const useForgotOpen = () => useAppAction(forgotOpen);

//export const useQuickviewClose = () => useAppAction(quickviewClose);
