/**
 * Created by Sheldon Lee on 2/14/2016.
 */
import React from 'react';
import {connect} from 'react-redux';
import '../styles/container/image-viewer-container.css';

class ImageViewerContainer extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="transient-layer-container">
                <div className="transient-layer fade" aria-hidden="true"></div>
                <div className="transient-layer-function-container" aria-hidden="true">
                    <a href="javascript:;" className="transient-layer-link close-transient-layer-link close-symbol" title="Click to leave image viewer"><span className="accessibility-hidden">Click to quit viewing the document</span></a>
                    <a href="javascript:;" className="transient-layer-link save-file-link download-icon" title="Click to save this image"><span className="download-icon-span"></span><span className="accessibility-hidden">Click to save file to your computer</span></a>
                    <a href="javascript:;" className="transient-layer-link img-rotate-clock-wise-link">><span className="accessibility-hidden">Click to rotate image clock-wise</span></a>
                    <a href="javascript:;" className="transient-layer-link img-rotate-counter--clock-wise-link" >{String.fromCharCode(60)}<span className="accessibility-hidden">Click to rotate image counter-clock-wise</span></a>
                </div>
                {generateImages.call(this)}
            </div>
        );
    }

}

const generateImages = function() {
    if (this.props.files) {
        return (<div className="transient-layer-content-container">
            <img src="test.jpg" alt="Image not available"/>
        </div>);
    }

    return undefined;
};

function mapStateToProps(state, props) {
    //if (state.FileUploadReducer.get(props.componentId)) {
    return state.ImageViewerReducer.get(props.componentId, undefined);
    //} else {
    //    return {};
    //}
}

export default connect(mapStateToProps)(ImageViewerContainer)
