/**
 * Created by Sheldon Lee on 4/13/2017.
 */
import { combineReducers } from 'redux';
import postsReducer from './posts-reducer';
import redirectRedcuer from './redirect-reducer';
import {reducer as formReducer} from 'redux-form';

const rootReducer = combineReducers({
    posts: postsReducer,
    form: formReducer,
    redirect: redirectRedcuer
});

export default rootReducer;