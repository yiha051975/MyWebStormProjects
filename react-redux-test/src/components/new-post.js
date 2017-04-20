/**
 * Created by Sheldon Lee on 4/14/2017.
 */
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Field, reduxForm} from 'redux-form';
import {createPost} from '../actions/posts-actions';
import { connect } from 'react-redux';

class NewPost extends Component {
    onSubmit(props) {
        console.log(this);
        this.props.createPost(props)
            .then(() => {
                // blog post has been created, navigate user to the index
                // We navigate by calling this.context.rounter.push with
                // new path to navigate to.
                this.context.router.push('/');
            });
    }

    render() {
        return (
            <div>
                <h2>This is Form Page.</h2>
                <Link to="/">Home</Link>
                <form onSubmit={this.props.handleSubmit(this.onSubmit.bind(this))}>
                    <div>
                        <label>Title</label>
                        <Field type="text" component="input" name="title" />
                    </div>
                    <div>
                        <label>Description</label>
                        <Field type="text" component="input" name="description" />
                    </div>
                    <div>
                        <label>Content</label>
                        <Field type="text" component="input" name="content" />
                    </div>
                    <button type="submit" value="Submit">Submit</button>
                </form>
            </div>
        );
    }
}

NewPost = reduxForm({
    form: 'newPost'
})(NewPost);

NewPost = connect(null, {createPost})(NewPost);

export default NewPost;