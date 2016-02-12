/**
 * Created by Sheldon Lee on 1/30/2016.
 */
import * as actions from '../actions/action-type';
import Immutable from 'immutable';

export default function FileUploadReducer(state=Immutable.Map({}), action={}) {
    //let newState = deepCopy(state);
    let newState = state;
    let filesArr;
    switch (action.type) {
        case actions.ATTACH_FILE:

            if (!newState.get(action.payload.parentId, undefined)) {
                newState = newState.set(action.payload.parentId, Immutable.Map({}));
                newState = newState.update(action.payload.parentId, x => x.set('files', Immutable.List([])));
            }

            //if (!newState[action.payload.parentId]) {
            //    newState[action.payload.parentId] = {};
            //    if (!newState[action.payload.parentId].files) {
            //        newState[action.payload.parentId].files = [];
            //    }
            //}

            for (let i = 0; i < action.payload.files.length; i++) {
                newState = newState.updateIn([action.payload.parentId, 'files'], x => x.set(x.count(), Immutable.Map(action.payload.files[i])));
                //newState[action.payload.parentId].files.push(action.payload.files[i]);
            }

            return newState;
        case actions.UPLOAD_SINGLE_FILE_STARTED:
            filesArr = newState.getIn([action.payload.parentId, 'files'], undefined);
            if (filesArr) {
                newState = newState.updateIn([action.payload.parentId, 'files', filesArr.findIndex(file => file.get('id') === action.payload.file.id), 'isUploading'], isUploading => false);
            }
            return newState;
        case actions.UPLOAD_SINGLE_FILE_SUCCESS:
            filesArr = newState.getIn([action.payload.parentId, 'files'], undefined);
            if (filesArr) {
                let index = filesArr.findIndex(file => file.get('id') === action.payload.file.id);
                newState = newState.updateIn([action.payload.parentId, 'files', index, 'isUploading'], isUploading => false);
                newState = newState.updateIn([action.payload.parentId, 'files', index, 'isUploaded'], isUploaded => true);
            }
            return newState;
        case actions.UPLOAD_ALL:

            for (let i = 0; i < newState.files.length; i++) {
                if (!newState.files[i].isUploaded && !newState.files[i].isUploading) {
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
            newState = newState.updateIn([action.payload.parentId, 'files'], files => files.splice(files.findIndex(file => file.get('id') === action.payload.file.id), 1));
            //let index = newState[action.parentId].files.indexOf(action.file);
            //newState[action.parentId].files.splice(index, 1);

            return newState;
        case actions.REMOVE_ALL:

            if (newState.get(action.payload.parentId, undefined) && newState.getIn([action.payload.parentId, 'files'], undefined)) {
                for (let y = newState.getIn([action.payload.parentId, 'files'], undefined).count() - 1; y >= 0; y--) {
                    if (!newState.getIn([action.payload.parentId, 'files', y, 'isUploaded'], undefined) && !newState.getIn([action.payload.parentId, 'files', y, 'isUploading'], undefined)) {
                        newState = newState.updateIn([action.payload.parentId, 'files'], files => files.splice(y, 1));
                    }
                }
            }

            //if (newState[action.parentId] && newState[action.parentId].files) {
            //    for (let y = newState[action.parentId].files.length - 1; y >= 0; y--) {
            //        if (!newState[action.parentId].files[y].isUploaded) {
            //            newState[action.parentId].files.splice(y, 1);
            //        }
            //    }
            //}

            return newState;
        default:
            return newState;
    }
}

/**
 * @deprecated
 *
 * Use this function to clone the state obj
 * @param obj
 * @returns {*}
 */
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
