/**
 * Created by Sheldon Lee on 2/14/2016.
 */
import React from 'react';
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
                    <a href="javascript:;" className="transient-layer-link close-transient-layer-link close-symbol"><span className="accessibility-hidden">Click to quit viewing the document</span></a>
                    <a href="javascript:;" className="transient-layer-link save-file-link"><span className="accessibility-hidden">Click to save file to your computer</span></a>
                    <a href="javascript:;" className="transient-layer-link img-rotate-clock-wise-link">><span className="accessibility-hidden">Click to rotate image clock-wise</span></a>
                    <a href="javascript:;" className="transient-layer-link img-rotate-counter--clock-wise-link" >{String.fromCharCode(60)}<span className="accessibility-hidden">Click to rotate image counter-clock-wise</span></a>
                </div>
                <div className="transient-layer-content-container">
                    <img src="test.jpg" alt="Image not available" />
                </div>
            </div>
        );
    }

}

export default ImageViewerContainer;
