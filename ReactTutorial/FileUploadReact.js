/**
 * Created by Sheldon Lee on 1/16/2016.
 */
$(document).ready(function() {
    console.log('document is ready.');

    var FileUploadForm = React.createClass({
        fileUploadInputID: undefined,
        inputOnChange: function(e) {
            var input = e.target;
            var form = input.parentElement;
            var files = input.files;
            var formData = new FormData();
            formData.append('fileUploadInput', files[0]);

            $.ajax({
                url: 'http://localhost:63341/api/FileUpload',
                type: 'post',
                processData: false,
                contentType: false,
                data: new FormData(form),
                success: function(json) {
                    console.log(json);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log("error :" + XMLHttpRequest.responseText);
                }
            });
            console.log(files);
        },
        generateUniqueIdForFileUploadInput: function() {
            if (!this.fileUploadInputID) {
                this.fileUploadInputID = 'file-upload-input-' + new Date().getTime();
            }

            return this.fileUploadInputID;
        }.bind(this),
        render: function() {
            return (
                <div className="file-upload-container" id="">
                    <form encType="multipart/form-data" className="file-upload-form">
                        <label className="file-upload-label" htmlFor={this.generateUniqueIdForFileUploadInput()}>Select a file: </label>
                        <input type="file" className="file-upload-input" name="fileUploadInput" id={this.generateUniqueIdForFileUploadInput()} onChange={this.inputOnChange}/>
                    </form>
                </div>
            );
        }
    });

    ReactDOM.render(
        <FileUploadForm />,
        document.getElementById('content')
    );
});