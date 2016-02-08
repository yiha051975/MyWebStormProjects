/**
 * Created by Sheldon Lee on 1/23/2016.
 */
import * as actionTypes from './action-type.js';
import guid from '../../guid/guid.js';

export function toggleButton(isToggleOn, containerId) {
    return {
        type: actionTypes.TOGGLE_BUTTON,
        isToggleOn: isToggleOn,
        containerId: containerId
    };
}

export function attachFile(files, parentId) {
    let returnFiles = {};
    returnFiles.files = [];
    for (var i = 0; i < files.length; i++) {
        let file = {
            id: guid(),
            file: files.item(i),
            isUploaded: false,
            uploadedDate: undefined
        };

        returnFiles.files.push(file);
    }
    returnFiles.parentId = parentId;
    returnFiles.type = actionTypes.ATTACH_FILE;
    return returnFiles;
}

export function uploadFile(file, containerId, progressBar) {
    return {
        type: actionTypes.UPLOAD_FILE,
        file: Object.assign({}, file, {progressBar: progressBar}),
        parentId: containerId
    }
}

export function removeFile(file, containerId) {
    return {
        type: actionTypes.REMOVE_FILE,
        parentId: containerId,
        file: file
    };
}

export function removeAll(containerId) {
    return {
        type: actionTypes.REMOVE_ALL,
        parentId: containerId
    }
}
