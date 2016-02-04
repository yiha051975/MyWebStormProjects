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

    render() {
        return (
            <div>
                <div className="file-upload-link-container">
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
