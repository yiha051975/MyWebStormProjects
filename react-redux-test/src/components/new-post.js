/**
 * Created by Sheldon Lee on 4/14/2017.
 */
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Field, reduxForm} from 'redux-form';
import {createPost} from '../actions/posts-actions';
import {redirect} from '../actions/redirect-actions';
import { connect } from 'react-redux';
import {LANDING_PAGE} from '../utils/routes';
import {browserHistory} from 'react-router';

const required = function(value) {
    if (!value) {
        return 'required.';
    }
};

class NewPost extends Component {
    onSubmit(props) {
        console.log('form data: ', props);
        this.props.createPost(props, () => browserHistory.push(LANDING_PAGE));
    }

    renderInputField({questionText, type, input, fieldId, meta: {touched, error, warning}}) {
        return (
            <div className={`form-group${touched && error ? ' has-danger' : ''}`}>
                <div>
                    <label htmlFor={fieldId}>{questionText}</label>
                </div>
                <div>
                    <input type={type} {...input} id={fieldId} className="form-control" />
                </div>
                <div className="text-help">
                    {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
                </div>
            </div>
        );
    }

    renderTextArea({questionText, input, fieldId, meta: {touched, error, warning}}) {
        return (
            <div className={`form-group${touched && error ? ' has-danger' : ''}`}>
                <div>
                    <label htmlFor={fieldId}>{questionText}</label>
                </div>
                <div>
                    <textarea {...input} id={fieldId} className="form-control" />
                </div>
                <div className="text-help">
                    {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
                </div>
            </div>
        )
    }

    render() {
        return (
            <div>
                <h2>This is Form Page.</h2>
                <Link to={LANDING_PAGE}>Home</Link>
                <form onSubmit={this.props.handleSubmit(this.onSubmit.bind(this))}>
                    <Field name="title" component={this.renderInputField} type="text" questionText="Title" fieldId="title" validate={[required]} />
                    <Field name="description" component={this.renderInputField} type="text" questionText="Description" fieldId="description" validate={required} />
                    <Field name="content" component={this.renderTextArea} questionText="Content" fieldId="content" validate={required}/>
                    <button type="submit" value="Submit" disabled={!this.props.valid} className="btn btn-primary">Submit</button>
                </form>
            </div>
        );
    }
}

NewPost = reduxForm({
    form: 'newPost'
})(NewPost);

NewPost = connect(null, {createPost, redirect})(NewPost);

export default NewPost;