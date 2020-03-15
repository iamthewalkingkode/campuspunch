import { SET_SITE_LANG, SET_PAGE_TITLE, SET_HEADER_TITLES } from '../_types';

export function setMetaTags(data) {
    return dispatch => {
        dispatch({ type: SET_PAGE_TITLE, data });
    }
};

export function setHeaderTitle(data) {
    return dispatch => {
        dispatch({ type: SET_HEADER_TITLES, data });
    }
};

export function setSiteLang(lang) {
    return dispatch => {
        dispatch({ type: SET_SITE_LANG, lang});
    }
};