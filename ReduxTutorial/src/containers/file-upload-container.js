/**
 * Created by Sheldon Lee on 1/30/2016.
 */
import React from 'react';
import {connect} from 'react-redux';
import guid from '../guid/guid.js';
import {attachFile, uploadFiles} from '../redux/actions/action-creator.js';
import DocumentUploadListItem from '../components/document-upload/document-upload-list-item.js';
import '../styles/containers/file-upload-container.css';

class FileUploadContainer extends React.Component {

    componentWillMount() {
        this.componentId = guid();
    }

    fileInputChange(e) {
        let input = e.target;
        let files = input.files;

        this.props.dispatch(attachFile(files[0], this.componentId));
        input.value = '';
        this.fileAttachLabel.focus();
    }

    documentUploadListItemHandle() {
        'use strict';
        if (this.props.FileUploadReducer.files && this.props.FileUploadReducer.files.length > 0) {
            return this.props.FileUploadReducer.files.map(function(file, index) {
                return (
                    <li className="file-upload-list-item">
                        <DocumentUploadListItem key={index} componentId={file.id} file={file.file} isUploaded={file.isUploaded} uploadedDate={file.uploadedDate} />
                    </li>
                );
            });
        } else {
            return undefined;
        }
    }

    findFocusableElement(node) {
        let returnNode = node;

        if (node.tabIndex < 0) {
            returnNode = this.findFocusableElement(node.parentElement);
        }

        return returnNode;
    }

    spacebarPressed(e) {
        if (e.which === 32 || e.which === 13) {
            e.preventDefault();
            let node = e.target;
            if (node) {
                node = this.findFocusableElement.call(this, node);
                node.click();
            }
        }
    }

    render() {
        return (
            <div>
                <div>Files</div>
                <div className="file-upload-function-bar">
                    <div className="file-upload-button-container">
                        <input type="file" id={this.componentId} className="file-upload-hidden-input accessibility-hidden" aria-hidden="true" onChange={this.fileInputChange.bind(this)} tabIndex="-1" multiple accept="image/*,application/pdf" />
                        <label htmlFor={this.componentId} className="file-upload-button file-upload-button-success" ref={(label) => this.fileAttachLabel = label} role="button" tabIndex="0" onKeyPress={this.spacebarPressed.bind(this)}>
                            <span className="add-files-icon" role="presentation"></span>
                            <span>Add files...</span>
                            <span className="accessibility-hidden">Click to add a file for upload</span>
                        </label>
                    </div>
                    <div className="file-upload-button-container">
                        <button className="file-upload-button file-upload-button-upload">
                            <span className="start-upload-icon" role="presentation">
                                <span className="start-upload-icon-after">
                                    <span className="start-upload-icon-last"></span>
                                </span>
                            </span>
                            <span>Start upload</span>
                            <span className="accessibility-hidden">Click to upload all files</span>
                        </button>
                    </div>
                </div>
                <ul className="file-upload-unordered-list">
                    {this.documentUploadListItemHandle()}
                </ul>

            </div>
        );
    }
}

function mapStateToProps(state, props) {
    /*return {
     isToggleOn: state.buttonToggleReducer.isToggleOn
     };*/
    return state;
}

export default connect(mapStateToProps)(FileUploadContainer)
