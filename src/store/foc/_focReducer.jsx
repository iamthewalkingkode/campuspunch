import { FOC_VOTE } from '../_types';

const initialState = {
    voting: false
};

const dataReducer = (state = initialState, action) => {
    switch (action.type) {
        default:
            return state;

        case FOC_VOTE:
            return {
                ...state,
                voting: action.value
            };
    }
};


export default dataReducer;