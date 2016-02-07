/**
 * Created by Sheldon Lee on 1/30/2016.
 */
import * as actions from '../actions/action-type';

export default function FileUploadReducer(state={}, action={}) {
    let newState;
    switch (action.type) {
        case actions.ATTACH_FILE:
            newState = deepCopy(state);

            if (!newState[action.parentId]) {
                newState[action.parentId] = {};
                if (!newState[action.parentId].files) {
                    newState[action.parentId].files = [];
                }
            }

            for (let i = 0; i < action.files.length; i++) {
                newState[action.parentId].files.push(action.files[i]);
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
        case actions.REMOVE_FILE:
            newState = deepCopy(state);

            let index = newState[action.parentId].files.indexOf(action.file);
            newState[action.parentId].files.splice(index, 1);

            return newState;
        default:
            return state;
    }
}

const deepCopy = function(obj) {
    if (obj) {
        if (obj.constructor === Array) {
            let newArray = [
                ...obj
            ];

            return newArray;
        } else if (typeof obj === 'object') {
            let newObject = {};

            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    newObject[key] = deepCopy(obj[key]);
                }
            }

            return newObject;
        } else {
            return obj;
        }
    } else {
        return undefined;
    }
};
