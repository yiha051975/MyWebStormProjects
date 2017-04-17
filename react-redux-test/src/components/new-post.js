/**
 * Created by Sheldon Lee on 4/14/2017.
 */
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Field, reduxForm} from 'redux-form';

class NewPost extends Component {
    render() {
        return (
            <div>
                <h2>This is Form Page.</h2>
                <Link to="/">Home</Link>
                <form>
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
                </form>
            </div>
        );
    }
}

export default reduxForm({
    form: 'NewPost'
}, null, null)(NewPost);