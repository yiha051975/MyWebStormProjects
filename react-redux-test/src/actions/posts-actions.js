/**
 * Created by Sheldon Lee on 4/19/2017.
 */
import axios from 'axios';
import {POST_NEW} from './action-types';
import {redirect} from './redirect-actions';
import {LANDING_PAGE} from '../utils/routes';

const create_post_url = 'http://localhost:3000/post';

export function createPost(props) {
    return (dispatch) => {
        axios.post(create_post_url, props).then((response) => {
                dispatch(redirect(LANDING_PAGE));
                return {
                    type: POST_NEW,
                    payload: response
                }
            }).catch((response) => {
                dispatch(redirect(LANDING_PAGE));
                return {
                    type: POST_NEW,
                    payload: response
                }
            });
    }
}