import { SET_SITE_LANG, SET_PAGE_TITLE, SET_HEADER_BOTTOM, SET_FOOTER_TOP } from '../_types';

export function setMetaTags(data) {
    return dispatch => {
        dispatch({ type: SET_PAGE_TITLE, data });
    }
};

export function setHeaderBottom(data) {
    return dispatch => {
        dispatch({ type: SET_HEADER_BOTTOM, data });
    }
};

export function setFooterTop(data) {
    return dispatch => {
        dispatch({ type: SET_FOOTER_TOP, data });
    }
};

export function setSiteLang(lang) {
    return dispatch => {
        dispatch({ type: SET_SITE_LANG, lang});
    }
};