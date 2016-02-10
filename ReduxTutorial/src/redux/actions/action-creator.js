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
    let returnFiles = {
        type: actionTypes.ATTACH_FILE,
        payload: {
            parentId: parentId,
            files: (function() {
                let mappedFiles = [];

                for (var i = 0; i < files.length; i++) {
                    let file = {
                        id: guid(),
                        file: files.item(i),
                        isUploaded: false,
                        isUploading: false,
                        uploadedDate: undefined
                    };

                    mappedFiles.push(file);
                }

                return mappedFiles;
            }())
        },
        error: false,
        meta: {}
    };
    //returnFiles.type =
    //returnFiles.files = [];
    //for (var i = 0; i < files.length; i++) {
    //    let file = {
    //        id: guid(),
    //        file: files.item(i),
    //        isUploaded: false,
    //        isUploading: false,
    //        uploadedDate: undefined
    //    };
    //
    //    returnFiles.files.push(file);
    //}
    //returnFiles.parentId = parentId;
    //returnFiles.type = actionTypes.ATTACH_FILE;

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
        payload: {
            parentId: containerId,
            file: file
        },
        error: false,
        meta: {}
    };
}

export function removeAll(containerId) {
    return {
        type: actionTypes.REMOVE_ALL,
        payload: {
            parentId: containerId
        },
        error: false,
        meta: {}
    }
}

const uploadSingleFile = function(file, containerId, progressBar) {
    let xhr = new XMLHttpRequest();
    if (xhr.upload) {
        xhr.upload.addEventListener("progress", function(e) {
            var pc = parseInt(e.loaded / e.total * 100);
            progressBar.style.width = pc + "%";
            progressBar.parentElement.setAttribute('aria-valuenow', pc.toString());
        }, false);
        xhr.onreadystatechange = function(e) {
            if (xhr.readyState == 4) {
                console.log(xhr.status == 200 ? "success" : "failure");
            }
        };

        xhr.open('POST', '/api/upload', true);
        let formData = new FormData();
        formData.append('fileUpload', file.file);
        xhr.send(formData);
    }
};
