/**
 * Created by Sheldon Lee on 1/23/2016.
 */
import React from "react";
import ReactDOM from "react-dom";
import {Provider} from 'react-redux';
import configureStore from './redux/main.js';
import ButtonToggleContainer from './containers/button-toggle-container.js';
import buttonToggleApp from './redux/reducers/redux-index.js';
import { createStore } from 'redux';

//let store = createStore(buttonToggleApp);
let Store = configureStore();

ReactDOM.render(
    <Provider store={Store}>
        <div>
            <h1>Redux Tutorial</h1>
            <ButtonToggleContainer />
            <ButtonToggleContainer />
        </div>
    </Provider>,
    document.getElementById('app')
);
