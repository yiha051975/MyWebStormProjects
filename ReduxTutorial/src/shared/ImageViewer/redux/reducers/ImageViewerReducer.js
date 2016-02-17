/**
 * Created by iti8218 on 2/16/2016.
 */
import * as imageViewerActions from '../actions/ImageViewerActionTypes';
import Immutable from 'immutable';

export default function ImageViewerReducer(state = Immutable.Map({}), action) {
    let newState = state;
    switch (action.type) {
        case imageViewerActions.CREATE_IMAGE_VIEWER:
            if (!state.get(action.payload.fileUploadId)) {
                newState.set(action.payload.fileUploadId, Immutable.List(action.payload.files));
            }

            return newState;
        default:
            return state;
    }
}
