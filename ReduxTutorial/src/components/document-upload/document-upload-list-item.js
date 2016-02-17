/**
 * Created by Sheldon Lee on 1/30/2016.
 */
import React from 'react';
import '../../styles/components/document-upload-list-item.css';

let months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

export default class DocumentUploadListItem extends React.Component {

    constructor(props) {
        super(props);
        // This will perform check on the props, if the props changes, render will be invoked. If not, then render won't be invoked.
        this.shouldComponentUpdate = require('react/lib/ReactComponentWithPureRenderMixin').shouldComponentUpdate.bind(this);
    }

    displayPreviewPic() {
        if (this.props.file.isUploaded) {
            // will code later
            return (
                <div className="document-upload-list-item-container file-upload-file-preview">
                    <a href={this.props.file.fileUrl} target="_blank" className="file-preview-link">
                        <image src={this.props.file.previewUrl} alt={'preview picture for ' + this.props.file.file.name} />
                        <span className="accessibility-hidden">click to view file</span>
                    </a>
                </div>
            );
        } else {
            return (
                <div className="document-upload-list-item-container file-upload-file-preview">
                    <canvas width="80" height="60" ref={(canvas) => this.canvas = canvas} />
                </div>
            );
        }
    }

    displayFileName() {
        if (this.props.file.isUploaded) {
            return (
                <div className="document-upload-list-item-container document-upload-list-item-text-container file-name-container">
                    <a href={this.props.file.fileUrl} target="_blank" className="file-uploaded-link" ref={(linkNode) => this.link = linkNode} title={this.props.file.file.name}>
                        {this.props.file.file.name}
                        <span className="accessibility-hidden">Click to view file</span>
                    </a>
                </div>
            );
        } else {
            return (
                <div className="document-upload-list-item-container document-upload-list-item-text-container file-name-container">
                    <div className="file-name" title={this.props.file.file.name}>{this.props.file.file.name}</div>
                </div>
            );
        }
    }

    displayUploadedDateOrProgressBar() {
        if (this.props.file.isUploaded) {
            return (<div className="file-upload-date">Uploaded on {months[this.props.file.uploadedDate.getMonth()] + ' ' + this.props.file.uploadedDate.getDate() + ', ' + this.props.file.uploadedDate.getFullYear()}</div>);
        } else {
            return (
                <div className="file-upload-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
                    <div className="file-upload-progress-bar"
                         ref={(progressBar) => this.progressBar = progressBar}></div>
                </div>
            );
        }
    }

    displayFileSizeAndProgressbar() {
        return (
            <div className="document-upload-list-item-container document-upload-list-item-text-container file-upload-size-progress">
                <div>{formatBytes(this.props.file.file.size, 2)}</div>
                {this.displayUploadedDateOrProgressBar()}
            </div>
        );
    }

    displaySingleFileOperations() {
        if (this.props.file.isUploaded) {
            return undefined;
        } else {
            return (
                <div className="document-upload-list-item-container file-upload-function-bar">
                    <div className="file-upload-button-container">
                        <button className="file-upload-button file-upload-button-upload" onClick={() => this.props.uploadFile(this)}>
                                    <span className="start-upload-icon">
                                        <span className="start-upload-icon-last"></span>
                                    </span>
                            <span>Start</span>
                            <span
                                className="accessibility-hidden">Click here to upload {this.props.file.file.name}</span>
                        </button>
                    </div>
                    <div className="file-upload-button-container">
                        <button className="file-upload-button file-upload-button-cancel" onClick={this.cancelFile.bind(this)}>
                                    <span className="cancel-upload-icon">
                                        <span className="cancel-upload-icon-last"></span>
                                    </span>
                            <span>Cancel</span>
                            <span className="accessibility-hidden">Click here to remove {this.props.file.file.name} from upload queue</span>
                        </button>
                    </div>
                </div>
            );
        }
    }

    cancelFile() {
        if (!this.props.file.isUploaded && !this.props.file.isUploading) {
            let instance = this;
            instance.listItem.classList.remove('in');
            let timeout;
            timeout = setTimeout(function () {
                instance.props.removeFile(instance.props.file);
                clearTimeout(timeout);
            }, 150);
        }
    }

    componentDidUpdate() {
        var instance = this;
        if (!this.props.file.isUploaded) {
            createPreviewPicForFile.call(this);
        }

        if (this.props.file.isUploaded || this.props.file.isUploading) {
            setTimeout(function () {
                fadein(instance.listItem);
            }, 150);
        }
    }

    componentDidMount() {
        if (!this.props.file.isUploaded) {
            createPreviewPicForFile.call(this);
        }
    }

    render() {
        return (
            <li className="file-upload-list-item fade" ref={listItem => this.listItem = listItem}>
                <div>
                    <div className="file-upload-link-container">
                        {this.displayPreviewPic()}
                        {this.displayFileName()}
                        {this.displayFileSizeAndProgressbar()}
                        {this.displaySingleFileOperations()}
                    </div>
                </div>
            </li>
        );
    }
}

DocumentUploadListItem.propTypes = {
    file: React.PropTypes.object.isRequired,
    removeFile: React.PropTypes.func.isRequired,
    uploadFile: React.PropTypes.func.isRequired
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

const createPreviewPicForFile = function() {
    let imgUrl = URL.createObjectURL(this.props.file.file);
    let ctx = this.canvas.getContext('2d');
    let img = new Image;
    img.onload = (function() {
        if (this.canvas) {
            let shrinkedWidth = calculateImageWidth(img);
            this.canvas.width = shrinkedWidth;
            ctx.drawImage(img, 0, 0, shrinkedWidth, 60);
        }
        URL.revokeObjectURL(imgUrl);

        fadein(this.listItem);
    }).bind(this);
    img.src = imgUrl;
};

const fadein = function(listItem) {
    if (listItem) {
        let showItem = true;
        for (let index in listItem.classList) {
            if (listItem.classList[index] === 'in') {
                showItem = false;
                break;
            }
        }

        if (showItem === true) {
            listItem.classList.add('in');
        }
    }
};
