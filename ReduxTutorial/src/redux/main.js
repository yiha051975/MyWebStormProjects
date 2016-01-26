/**
 * Created by Sheldon Lee on 1/23/2016.
 */
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import buttonToggleApp from './reducers/redux-index.js';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

//export default createStoreWithMiddleware(buttonToggleApp);
export default function configureStore(initialState) {
    return createStoreWithMiddleware(buttonToggleApp, initialState);
}
