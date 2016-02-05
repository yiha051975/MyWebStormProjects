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
            parentId: parentId,
            file: files.item(i),
            isUploaded: false,
            uploadedDate: undefined
        };

        returnFiles.files.push(file);
    }
    returnFiles.type = actionTypes.ATTACH_FILE;
    return returnFiles;
}

export function uploadFiles(files, containerId) {
    return {
        type: actionTypes.UPLOAD_FILE,
        files: files,
        containerId: containerId
    }
}
