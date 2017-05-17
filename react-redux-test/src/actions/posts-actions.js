/**
 * Created by Sheldon Lee on 4/19/2017.
 */
import axios from 'axios';
import {POST_NEW} from './action-types';
import {LANDING_PAGE} from '../utils/routes';

const create_post_url = 'http://localhost:3000/post';

export function createPost(props, successCallback, failedCallback) {
    return (dispatch) => {
        axios.post(create_post_url, props).then((response) => {
                if (successCallback && typeof successCallback === 'function') {
                    successCallback();
                }
                return {
                    type: POST_NEW,
                    payload: response
                }
            }).catch((response) => {
                if (failedCallback && typeof failedCallback === 'function') {
                    failedCallback();
                }
                return {
                    type: POST_NEW,
                    payload: response
                }
            });
    }
}