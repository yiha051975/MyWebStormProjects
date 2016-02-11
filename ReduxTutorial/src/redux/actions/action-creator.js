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

    return returnFiles;
}

export function uploadFile(file, containerId, progressBar, canvas) {
    //return {
    //    type: actionTypes.UPLOAD_FILE,
    //    payload: {
    //        file: Object.assign({}, file, {progressBar: progressBar, canvas: canvas}),
    //        parentId: containerId
    //    },
    //    error: false,
    //    meta: {}
    //}
    return dispatch => {
        let xhr = new XMLHttpRequest();
        dispatch(uploadSingleFileStarted(file, containerId));

        if (xhr.upload) {
            xhr.upload.addEventListener("progress", function(e) {
                var pc = parseInt(e.loaded / e.total * 100);
                progressBar.style.width = pc + "%";
                progressBar.parentElement.setAttribute('aria-valuenow', pc.toString());
            }, false);
        }

        xhr.onreadystatechange = function(e) {
            if (xhr.readyState == 4) {
                if (xhr.status === 200) {
                    dispatch(uploadSingleFileSuccess(file, containerId));
                }

                console.log(xhr.status == 200 ? "success" : "failure");
                console.log(e);
            }
        };

        xhr.open('POST', '/api/upload', true);
        let formData = new FormData();
        let previewFile = convertBlobToFile(convertDataURLToBlob(canvas.toDataURL()), 'preview_' + file.file.name, file.file.type);
        formData.append('fileUpload', file.file);
        formData.append('preview', previewFile);
        xhr.send(formData);
    }
}

export function uploadSingleFileStarted(file, containerId) {
    return {
        type: actionTypes.UPLOAD_SINGLE_FILE_STARTED,
        payload: {
            parentId: containerId,
            file: file
        },
        error: false,
        meta: {}
    }
}

export function uploadSingleFileSuccess(file, containerId) {
    return {
        type: actionTypes.UPLOAD_SINGLE_FILE_SUCCESS,
        payload: {
            parentId: containerId,
            file: file
        },
        error: false,
        meta: {}
    }
}

export function uploadSingleFileFailed(file, containerId, errorMessage) {
    return {
        type: actionTypes.UPLOAD_SINGLE_FILE_FAILED,
        payload: {
            parentId: containerId,
            file: file
        },
        error: true,
        meta: {
            message: errorMessage
        }
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

const uploadSingleFile = function(file, containerId, progressBar, canvas) {
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
        let previewFile = convertBlobToFile(convertDataURLToBlob(canvas.toDataURL()), 'preview_' + file.file.name)
        formData.append('fileUpload', file.file);
        formData.append('preview', previewFile);
        xhr.send(formData);
    }
};

/**
 * Convert Data Url to blob object
 * @param dataURL
 * @returns {global.Blob}
 */
const convertDataURLToBlob = function(dataURL) {
// convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURL.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURL.split(',')[1]);
    else
        byteString = decodeURI(dataURL.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
};

/**
 * A Blob() is almost a File() - it's just missing the two properties below which we will add
 * @param blob
 * @param fileName
 * @returns {*}
 */
const convertBlobToFile = function(blob, fileName, type) {
    let file = new File([blob], fileName, {type: type});
    return file;
};
