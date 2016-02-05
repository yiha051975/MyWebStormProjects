/**
 * Created by Sheldon Lee on 1/30/2016.
 */
import React from 'react';

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
                <div className="file-upload-file-preview">
                    <canvas width="80" height="45" ref={(canvas) => this.canvas = canvas} />
                </div>
            );
        }
    }

    displayFileName() {
        if (this.props.isUploaded) {
            return (<a href={this.props.link} target="_blank" className="file-uploaded-link" ref={(linkNode) => this.link = linkNode}>{this.props.file.name}</a>)
        } else {
            return (<div className="file-name">{this.props.file.name}</div>)
        }
    }

    displayUploadedDate() {
        if (this.props.isUploaded && this.props.uploadedDate) {
            return (<div>{this.props.uploadedDate}</div>);
        } else {
            return undefined;
        }
    }

    calculateImageWidth(img) {
        let shrinkRatio = 45 / img.height;

        return img.width * shrinkRatio;
    }

    componentDidMount() {
        let imgUrl = URL.createObjectURL(this.props.file);
        let ctx = this.canvas.getContext('2d');
        let img = new Image;
        img.onload = (function() {
            let shrinkedWidth = this.calculateImageWidth(img);
            this.canvas.width = shrinkedWidth;
            ctx.drawImage(img, 0, 0, shrinkedWidth, 45);
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
