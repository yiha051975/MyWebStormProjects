/**
 * Created by Sheldon Lee on 4/14/2017.
 */
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {redirect} from '../actions/redirect-actions';
import {redirectUtils} from '../utils/redirect-utils';

class LandingPage extends Component {
    render() {
        return (
            <div>
                <h2>This is landing page.</h2>
                <Link to="/form" onClick={(e) => {redirectUtils.call(this, e, '/form');}}>Create new Post</Link>
            </div>
        );
    }
}

export default connect(null, {redirect})(LandingPage);
