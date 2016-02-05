/**
 * Created by Sheldon Lee on 1/30/2016.
 */
import * as actions from '../actions/action-type';

export default function FileUploadReducer(state={}, action={}) {
    let newState;
    switch (action.type) {
        case actions.ATTACH_FILE:
            let newAction = Object.assign({}, action);
            //delete newAction.type;
            newState = Object.assign({}, state);
            if (!newState.files) {
                newState.files = [];
            }
            for (let i = 0; i < newAction.files.length; i++) {
                newState.files.push(newAction.files[i]);
            }
            return newState;
        case actions.UPLOAD_FILE:
            newState = Object.assign({}, state);

            for (let i = 0; i < newState.files.length; i++) {
                if (!newState.files[i].isUploaded) {
                    let formData = new FormData();
                    formData.append('fileUpload', newState.files[i].file);
                    console.log(newState.files[i].file);
                    newState.files[i].isuploaded = true;
                    newState.files[i].uploadedDate = new Date();
                    // Call function to perform an ajax upload to the server
                }
            }

            return newState;
        default:
            return state;
    }
}
