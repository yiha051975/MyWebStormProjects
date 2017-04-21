/**
 * Created by Sheldon Lee on 4/21/2017.
 */
import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'

class RouterRedirect extends Component {
    shouldComponentUpdate() {
        console.log('Router Redirect should Component Update.');
        return false;
    }

    render() {
        console.log(this.props);
        return null;
    }
}

function mapStateToProps(state) {
    return {
        path: state.redirect.path
    }
}

export default withRouter(connect(mapStateToProps)(RouterRedirect))