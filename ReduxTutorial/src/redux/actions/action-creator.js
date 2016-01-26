/**
 * Created by Sheldon Lee on 1/23/2016.
 */
import * as actionTypes from './action-type.js';

export function toggleButton(isToggleOn) {
    return {
        type: actionTypes.TOGGLE_BUTTON,
        isToggleOn: isToggleOn
    };
}
