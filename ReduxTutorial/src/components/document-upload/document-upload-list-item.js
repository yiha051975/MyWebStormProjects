/**
 * Created by Sheldon Lee on 1/30/2016.
 */
import React from 'react';
import '../../styles/components/document-upload-list-item.css';

export default class DocumentUploadListItem extends React.Component {

    constructor(props) {
        super(props);
        // This will perform check on the props, if the props changes, render will be invoked. If not, then render won't be invoked.
        this.shouldComponentUpdate = require('react/lib/ReactComponentWithPureRenderMixin').shouldComponentUpdate.bind(this);
    }

    displayPreviewPic() {
        if (this.props.isUploaded) {
            // will code later
            return undefined;
        } else {
            return (
                <div className="document-upload-list-item-container file-upload-file-preview">
                    <canvas width="80" height="60" ref={(canvas) => this.canvas = canvas} />
                </div>
            );
        }
    }

    displayFileName() {
        if (this.props.isUploaded) {
            return (<a href={this.props.link} target="_blank" className="file-uploaded-link" ref={(linkNode) => this.link = linkNode}>{this.props.file.name}</a>)
        } else {
            return (<div className="document-upload-list-item-container document-upload-list-item-text-container file-name">{this.props.file.name}</div>)
        }
    }

    displayUploadedDate() {
        if (this.props.isUploaded && this.props.uploadedDate) {
            return (<div>{this.props.uploadedDate}</div>);
        } else {
            return undefined;
        }
    }

    componentDidMount() {
        let imgUrl = URL.createObjectURL(this.props.file);
        let ctx = this.canvas.getContext('2d');
        let img = new Image;
        img.onload = (function() {
            let shrinkedWidth = calculateImageWidth(img);
            this.canvas.width = shrinkedWidth;
            ctx.drawImage(img, 0, 0, shrinkedWidth, 60);
            URL.revokeObjectURL(imgUrl);
        }).bind(this);
        img.src = imgUrl;
    }

    render() {
        return (
            <div>
                <div className="file-upload-link-container">
                    {this.displayPreviewPic()}
                    {this.displayFileName()}
                    {this.displayUploadedDate()}
                    <div className="document-upload-list-item-container document-upload-list-item-text-container file-upload-size-progress">
                        <div>{formatBytes(this.props.file.size, 2)}</div>
                    </div>
                    <div className="document-upload-list-item-container file-upload-function-bar">
                        <div className="file-upload-button-container">
                            <button className="file-upload-button file-upload-button-upload">
                                <span className="start-upload-icon">
                                    <span className="start-upload-icon-last"></span>
                                </span>
                                <span>Start</span>
                                <span className="accessibility-hidden">Click here to upload {this.props.file.name}</span>
                            </button>
                        </div>
                        <div className="file-upload-button-container">
                            <button className="file-upload-button file-upload-button-cancel">
                                <span className="cancel-upload-icon">
                                    <span className="cancel-upload-icon-last"></span>
                                </span>
                                <span>Cancel</span>
                                <span className="accessibility-hidden">Click here to remove {this.props.file.name} from upload queue</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

DocumentUploadListItem.propTypes = {
    componentId: React.PropTypes.string.isRequired,
    isUploaded: React.PropTypes.bool.isRequired,
    file: React.PropTypes.object.isRequired
};

const formatBytes = function(bytes,decimals) {
    if(bytes == 0) return '0 Byte';
    var k = 1024;
    var dm = decimals + 1 || 3;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toPrecision(dm) + ' ' + sizes[i];
};

const calculateImageWidth = function(img) {
    let shrinkRatio = 60 / img.height;

    return img.width * shrinkRatio;
};
