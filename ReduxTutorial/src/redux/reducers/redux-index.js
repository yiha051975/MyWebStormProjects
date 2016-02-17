/**
 * Created by Sheldon Lee on 1/23/2016.
 */
import buttonToggleReducer from './button-toggle-reducer.js';
import FileUploadReducer from './file-upload-reducer.js';
import ImageViewerReducer from '../../shared/ImageViewer/redux/reducers/ImageViewerReducer';
import { combineReducers } from 'redux';

const buttonToggleApp = combineReducers({
    buttonToggleReducer,
    FileUploadReducer,
    ImageViewerReducer
});

export default buttonToggleApp;
