import { SIGNIN_SUCCESS, SIGNOUT_SUCCESS } from '../_types';
import * as func from '../../utils/functions';

export function signInSuccess(data) {
    return dispatch => {
        dispatch({ type: SIGNIN_SUCCESS, data });
    }
};

export function signOutSuccess() {
    return dispatch => {
        func.delStorage('user');
        func.delStorage('token');
        func.redirect(window.location.href);
        dispatch({ type: SIGNOUT_SUCCESS });
    }
};