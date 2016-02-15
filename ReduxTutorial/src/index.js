/**
 * Created by Sheldon Lee on 1/23/2016.
 */
import React from "react";
import ReactDOM from "react-dom";
import {Provider} from 'react-redux';
import configureStore from './redux/main.js';
import ButtonToggleContainer from './containers/button-toggle-container.js';
import FileUploadContainer from './containers/file-upload-container.js';
import ImageViewerContainer from './shared/ImageViewer/container/image-viewer-container';
import buttonToggleApp from './redux/reducers/redux-index.js';
import { createStore } from 'redux';
import './styles/index.css';
import guid from './guid/guid.js';

//let store = createStore(buttonToggleApp);
let Store = configureStore();

ReactDOM.render(
    <Provider store={Store}>
        <div className="page-wrapper">
            <div className="flow-wrapper">
                <h1>Redux Tutorial</h1>
                <FileUploadContainer componentId={guid()} />
                <FileUploadContainer componentId={guid()} />
            </div>
            <div className="image-viewer-content-container">
                <ImageViewerContainer />
            </div>
        </div>
    </Provider>,
    document.getElementById('app')
);
