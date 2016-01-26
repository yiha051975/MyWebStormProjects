import * as actionTypes from '../actions/action-type.js';

const initialState = {
    isToggleOn: true
};

export default function buttonToggleReducer(state = initialState, action = '') {
    switch (action.type) {
        case actionTypes.TOGGLE_BUTTON:
            return {isToggleOn: !action.isToggleOn};/*Object.assign({}, state)*/
        default:
            return state;
    }
}
