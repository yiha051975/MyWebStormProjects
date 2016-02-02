/**
 * Created by Sheldon Lee on 1/23/2016.
 */
import buttonToggleReducer from './button-toggle-reducer.js';
import FileUploadReducer from './file-upload-reducer.js';
import { combineReducers } from 'redux';

const buttonToggleApp = combineReducers({
    buttonToggleReducer,
    FileUploadReducer
});

export default buttonToggleApp;
