import { SIGNIN_SUCCESS, SIGNOUT_SUCCESS } from '../_types';
import * as func from '../../utils/functions';
import { message } from 'antd';

export function signInSuccess(token, data) {
    return dispatch => {
        dispatch({ type: SIGNIN_SUCCESS, data, token });
    }
};

export function signOutSuccess() {
    return dispatch => {
        message.success('success', 'You are now logged out!');
        func.delStorage('user');
        func.delStorage('token');
        func.redirect('/');
        dispatch({ type: SIGNOUT_SUCCESS });
    }
};