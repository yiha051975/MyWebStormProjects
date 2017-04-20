/**
 * Created by Sheldon Lee on 4/19/2017.
 */
import axios from 'axios';
import {POST_NEW} from './action-types';
const create_post_url = 'http://localhost:3000/post';

export function createPost(props) {
    console.log(props);
    return (dispatch) => {
        axios.post(create_post_url, props).then((response) => {
                console.log('success on ajax create post: ', response);
                return {
                    type: POST_NEW,
                    payload: response
                }
            }).catch((response) => {
                console.log('error on ajax create post: ', response);
                return {
                    type: POST_NEW,
                    payload: response
                }
            });
    }
}