import { SET_SET_SETTINGS } from '../_types';

import * as func from '../../utils/functions';

const logg = func.getStorageJson('user');

const initialState = {
    studentCategories: ['Prospective', 'Student', 'Graduate'],
    states: func.getStorageJson('states'),
    schools: func.getStorageJson('schools'),
    settings: func.getStorageJson('settings'),
    newsCategories: func.getStorageJson('newsCategories'),
    focContests: func.getStorageJson('focContests'),

    menus: [
        { name: 'News', link: 'news' },
        { name: 'Bidding', link: 'bidding' },
        { name: 'FaceOfCampus', link: 'face-of-campus' },
        { name: 'Post article', link: 'post-article', auth: true },
        { name: 'Sign In', link: 'user/signin', auth: false },
        { name: 'Sign Up', link: 'user/signup', auth: false },
        { name: 'Academy', link: 'academy', auth: true },
        // {
        //     name: 'Academy', link: 'academy', auth: true, subs: [
        //         { name: 'Academy', link: 'academy' },
        //         { name: 'Manage academy', link: 'academy/manage' },
        //         { name: 'Courses', link: 'academy/courses' },
        //         { name: 'Schools', link: 'academy/schools' },
        //         { name: 'Student profile', link: 'academy/profile' },
        //     ]
        // },
        {
            name: logg.username, link: 'user', auth: true, subs: [
                { name: 'My profile', link: 'u/' + logg.username },
                { name: 'Profile settings', link: 'user' },
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