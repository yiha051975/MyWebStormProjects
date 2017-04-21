/**
 * Created by Sheldon Lee on 4/21/2017.
 */
import {REDIRECT} from '../actions/action-types';

export default function(state={}, action) {
    console.log('redirect state: ', state);
    console.log('redirect action: ', action);
    switch (action.type) {
        case REDIRECT:
            return {
                ...state,
                path: action.payload.path
            };
        default:
            return state;
    }
}