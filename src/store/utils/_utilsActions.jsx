import { SET_SITE_LANG, SET_PAGE_TITLE, SET_SET_SETTINGS } from '../_types';

export function setMetaTags(data) {
    return dispatch => {
        dispatch({ type: SET_PAGE_TITLE, data });
    }
};

export function setSiteLang(lang) {
    return dispatch => {
        dispatch({ type: SET_SITE_LANG, lang});
    }
};

export function setSetSettings(key, value) {
    return dispatch => {
        dispatch({
            type: SET_SET_SETTINGS, key, value
        });
    }
};