/**
 * Created by Sheldon Lee on 4/14/2017.
 */
import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class LandingPage extends Component {
    render() {
        return (
            <div>
                <h2>This is landing page.</h2>
                <Link to="/form">Create new Post</Link>
            </div>
        );
    }
}

export default LandingPage;
