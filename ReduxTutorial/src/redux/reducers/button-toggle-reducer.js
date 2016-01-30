import * as actionTypes from '../actions/action-type.js';

/*const initialState = {
    isToggleOn: true
};*/

export default function buttonToggleReducer(state = {}, action = '') {
    switch (action.type) {
        case actionTypes.TOGGLE_BUTTON:
            let newAction = {};
            newAction[action.containerId] = action;
            newAction[action.containerId].isToggleOn = !action.isToggleOn;
            return Object.assign({}, state, newAction);/*{isToggleOn: !action.isToggleOn};*//*Object.assign({}, state)*/
        default:
            return state;
    }
}
