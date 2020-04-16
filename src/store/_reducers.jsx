import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import authReducer from './auth/_authReducer';
import dataReducer from './data/_dataReducer';
import utilsReducer from './utils/_utilsReducer';
import focReducer from './foc/_focReducer';

export default (history) =>
    combineReducers({
        router: connectRouter(history),
        _auth: authReducer,
        _utils: utilsReducer,
        _foc: focReducer,
        data: dataReducer
    });