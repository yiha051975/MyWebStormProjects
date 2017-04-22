/**
 * Created by Sheldon Lee on 4/19/2017.
 */
import axios from 'axios';
import {POST_NEW} from './action-types';
import {redirect} from './redirect-actions';
const create_post_url = 'http://localhost:3000/post';

export function createPost(props, history) {
    return (dispatch) => {
        axios.post(create_post_url, props).then((response) => {
                // history.push('/');
                dispatch(redirect('/'));
                return {
                    type: POST_NEW,
                    payload: response
                }
            }).catch((response) => {
                // history.push('/');
                dispatch(redirect('/'));
                return {
                    type: POST_NEW,
                    payload: response
                }
            });
    }
}