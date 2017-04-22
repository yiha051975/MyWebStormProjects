/**
 * Created by Sheldon Lee on 4/21/2017.
 */
import {REDIRECT} from './action-types';

export function redirect(path) {
    return {
        type: REDIRECT,
        payload: {
            path: path
        }
    };
}