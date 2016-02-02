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

export function attachFile(file, parentId) {
    return {
        id: guid(),
        parentId: parentId,
        type: actionTypes.ATTACH_FILE,
        file: file,
        isUploaded: false,
        uploadedDate: undefined
    }
}

export function uploadFiles(files, containerId) {
    return {
        type: actionTypes.UPLOAD_FILE,
        files: files,
        containerId: containerId
    }
}
