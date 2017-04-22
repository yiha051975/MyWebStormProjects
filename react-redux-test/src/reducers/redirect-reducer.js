/**
 * Created by Sheldon Lee on 4/21/2017.
 */
import {REDIRECT} from '../actions/action-types';

export default function(state={}, action) {
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