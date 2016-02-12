/**
 * Created by Sheldon Lee on 1/30/2016.
 */
import React from 'react';
import {connect} from 'react-redux';
import guid from '../guid/guid.js';
import {attachFile, uploadFile, removeFile, removeAll} from '../redux/actions/action-creator.js';
import DocumentUploadListItem from '../components/document-upload/document-upload-list-item.js';
import '../styles/containers/file-upload-container.css';

class FileUploadContainer extends React.Component {

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = require('react/lib/ReactComponentWithPureRenderMixin').shouldComponentUpdate.bind(this);
    }

    fileInputChange(e) {
        let input = e.target;
        let files = input.files;

        this.props.dispatch(attachFile(files, this.props.componentId));
        input.value = '';
        this.fileAttachLabel.focus();
    }

    fileRemove(file) {
        this.props.dispatch(removeFile(file, this.props.componentId))
    }

    uploadFile(documentUploadListItem) {
        this.props.dispatch(uploadFile(documentUploadListItem.props.file, this.props.componentId, documentUploadListItem.progressBar, documentUploadListItem.canvas))
    }

    documentUploadListItemHandle() {
        var instance = this;
        if (this.props.files && this.props.files.count() > 0) {
            return this.props.files.map(function(file, index) {
                return (
                    <DocumentUploadListItem key={index} file={file.toObject()} removeFile={instance.fileRemove.bind(instance)} ref={file.get('id')} uploadFile={instance.uploadFile.bind(instance)} />
                );
            });
        } else {
            return undefined;
        }
    }

    render() {
        return (
            <div>
                <div>Files</div>
                <div className="file-upload-function-bar">
                    <div className="file-upload-button-container">
                        <input type="file" id={this.props.componentId} className="file-upload-hidden-input accessibility-hidden" aria-hidden="true" onChange={this.fileInputChange.bind(this)} tabIndex="-1" multiple accept="image/*,application/pdf" />
                        <label htmlFor={this.props.componentId} className="file-upload-button file-upload-button-success" ref={(label) => this.fileAttachLabel = label} role="button" tabIndex="0" onKeyPress={buttonOnKeyPress}>
                            <span className="add-files-icon" role="presentation"></span>
                            <span>Add files...</span>
                            <span className="accessibility-hidden">Click to add files for upload</span>
                        </label>
                    </div>
                    <div className="file-upload-button-container">
                        <button className="file-upload-button file-upload-button-upload">
                            <span className="start-upload-icon" role="presentation">
                                <span className="start-upload-icon-last"></span>
                            </span>
                            <span>Start upload</span>
                            <span className="accessibility-hidden">Click to upload all files</span>
                        </button>
                    </div>
                    <div className="file-upload-button-container">
                        <button className="file-upload-button file-upload-button-remove-all" onClick={removeAllFile.bind(this)}>
                            <span className="file-upload-trash-icon" role="presentation">
                                <span className="trash-lid"></span>
                                <span className="trash-container"></span>
                                <span className="trash-line-1"></span>
                                <span className="trash-line-2"></span>
                                <span className="trash-line-3"></span>
                            </span>
                            <span>Remove all</span>
                            <span className="accessibility-hidden">Click to remove all files</span>
                        </button>
                    </div>
                </div>
                <ul className="file-upload-unordered-list">
                    {this.documentUploadListItemHandle.call(this)}
                </ul>

            </div>
        );
    }
}

const buttonOnKeyPress = function(e) {
    if (e.which === 32 || e.which === 13) {
        e.preventDefault();
        let node = e.target;
        if (node) {
            node = findFocusableElement( node);
            node.click();
        }
    }
};

const findFocusableElement = function(node) {
    let returnNode = node;

    if (node.tabIndex < 0) {
        returnNode = findFocusableElement(node.parentElement);
    }

    return returnNode;
};

const removeAllFile = function() {
    var instance = this;
    for (let key in this.refs) {
        if (!this.refs[key].props.file.isUploaded && !this.refs[key].props.file.isUploading) {
            if (this.refs[key].listItem) {
                this.refs[key].listItem.classList.remove('in');
            }
        }
    }

    let timeout = setTimeout(function() {
        instance.props.dispatch(removeAll(instance.props.componentId));
        clearTimeout(timeout);
    }, 150);
};

function mapStateToProps(state, props) {
    //if (state.FileUploadReducer.get(props.componentId)) {
        return {files: state.FileUploadReducer.getIn([props.componentId, 'files'], undefined)};
    //} else {
    //    return {};
    //}
}

export default connect(mapStateToProps)(FileUploadContainer)
