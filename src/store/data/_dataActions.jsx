import { SET_SET_SETTINGS } from '../_types';

export function setSetSettings(key, value) {
    return dispatch => {
        dispatch({
            type: SET_SET_SETTINGS, key, value
        });
    }
};