import { SET_SET_SETTINGS } from '../_types';

import * as func from '../../utils/functions';

const logg = func.getStorageJson('user');

const initialState = {
    studentCategories: ['Prospective', 'Student', 'Graduate'],
    states: func.getStorageJson('states'),
    schools: func.getStorageJson('schools'),
    settings: func.getStorageJson('settings'),
    newsCategories: func.getStorageJson('newsCategories'),
    musicGenres: func.getStorageJson('musicGenres'),
    focContests: func.getStorageJson('focContests'),

    menus: [
        { name: 'News', link: 'news' },
        { name: 'Bidding', link: 'bidding' },
        { name: 'FaceOfCampus', link: 'face-of-campus' },
        { name: 'Post article', link: 'post-article', _auth: true },
        { name: 'Academy', link: 'academy' },
        { name: 'Sign In', link: 'user/signin', _auth: false },
        { name: 'Sign Up', link: 'user/signup', _auth: false },
        {
            name: logg.username, link: 'user', _auth: true, subs: [
                { name: 'My profile', link: 'u/' + logg.username },
                { name: 'Profile settings', link: 'user' },
                { name: 'My academy', link: 'user/academy' },
                { name: 'Sign out', link: 'user/signout' },
            ]
        },
    ]
};

const dataReducer = (state = initialState, action) => {
    switch (action.type) {
        default:
            return state;

        case SET_SET_SETTINGS:
            return {
                ...state,
                [action.key]: action.value
            };
    }
};


export default dataReducer;