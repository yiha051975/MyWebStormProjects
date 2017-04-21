/**
 * Created by Sheldon Lee on 4/17/2017.
 */

export default function(state={}, action) {
    console.log('state: ', state);
    console.log('action: ', action);
    switch (action.type) {

        default:
            return state;
    }
}