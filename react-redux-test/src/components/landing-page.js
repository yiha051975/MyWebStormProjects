/**
 * Created by Sheldon Lee on 4/14/2017.
 */
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {redirect} from '../actions/redirect-actions';
import {FORM} from '../utils/routes';

class LandingPage extends Component {
    render() {
        return (
            <div>
                <h2>This is landing page.</h2>
                <Link to={FORM}>Create new Post</Link>
            </div>
        );
    }
}

export default connect(null, {redirect})(LandingPage);
