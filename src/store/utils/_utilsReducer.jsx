import { SET_SITE_LANG, SET_PAGE_TITLE, SET_PAGE_SUB_TITLE, SET_HEADER_TITLES } from '../_types';

const initialState = {
    meta: { title: 'CampusPunch', description: '', keywords: '' },
    pageSubTitle: '',
    headerTitles: { h1: '', h3: '', p: '', image: '' },
    lang: 'en',
    limit: 12
};

const utilsReducer = (state = initialState, action) => {
    switch (action.type) {
        default:
            return state;

        case SET_PAGE_TITLE:
            return {
                ...state,
                meta: action.data
            }

        case SET_PAGE_SUB_TITLE:
            return {
                ...state,
                pageSubTitle: action.title
            };

        case SET_HEADER_TITLES:
            return {
                ...state,
                headerTitles: action.data
            }

        case SET_SITE_LANG:
            return {
                ...state,
                lang: action.lang
            };
    }
};


export default utilsReducer;