import { FETCH_WEATHER } from '../actions/index';

export default function(state = [], action) {
    switch (action.type) {
        case FETCH_WEATHER:
            // similar to state.concat(action.payload.data)
            return [action.payload.data, ...state];
    }
    return state;
}