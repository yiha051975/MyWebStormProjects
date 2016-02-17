/**
 * Created by iti8218 on 2/16/2016.
 */
import * as imageViewerActions from './ImageViewerActionTypes';

export function createImageViewer(files, componentId) {
    return {
        type: imageViewerActions.CREATE_IMAGE_VIEWER,
        payload: {
            fileUploadId: componentId,
            files: files
        },
        error: false,
        meta: {}
    }
}
