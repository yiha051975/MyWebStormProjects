/**
 * Created by iti8218 on 1/26/2017.
 */
// State argument is not application state, only the state this reducer is responsible for
export default function(state = null, action) {
    switch (action.type) {
        case 'BOOK_SELECTED':
            return action.payload;
    }

    return state;
}